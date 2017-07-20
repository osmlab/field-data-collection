const eos = require("end-of-stream");
const getGeoJSON = require("osm-p2p-geojson");
const pump = require("pump");
const collect = require("collect-stream");
const through = require("through2");
const OsmSync = require("./osm-sync");
const generatePlaceholderOsmId = require("./generate-id");
const convert = require("./convert-geojson-osmp2p");

function osmp2p(createOsmDb) {
  var observationDb = createOsmDb("obs");
  var osmOrgDb = createOsmDb("osm");

  var netSync = OsmSync(observationDb, osmOrgDb);

  observationDb.on("error", console.log);
  osmOrgDb.on("error", console.log);

  return {
    ready,
    createNode,
    put,
    del,
    createObservation,
    putObservation,
    delObservation,
    query,
    queryGeoJSONStream,
    replicate,
    findReplicationTargets,
    listAnnotations,
    clearAllData,
    sync: netSync
  };

  function ready(cb) {
    observationDb.ready(onReady);
    osmOrgDb.ready(onReady);

    var pending = 2;
    function onReady() {
      if (--pending === 0) cb();
    }
  }

  function createNode(geojson, opts, cb) {
    var doc = convert.toOSM(geojson, "node");
    var id = generatePlaceholderOsmId();
    if (!doc.tags) doc.tags = {};
    doc.tags["osm-p2p-id"] = id;
    observationDb.put(id, doc, opts, cb);
  }

  function put(id, geojson, opts, cb) {
    var doc = convert.toOSM(geojson);
    observationDb.put(id, doc, opts, cb);
  }

  function del(id, opts, cb) {
    observationDb.del(id, opts, cb);
  }

  // TODO use tags.osm-p2p-id?
  // TODO handle this being an OSM.org ID _or_ a placeholder ID
  function createObservation(nodeId, geojson, opts, cb) {
    if (!cb && typeof opts === "function") {
      cb = opts;
      opts = {};
    }

    var doc = convert.toOSM(geojson, "observation");
    observationDb.create(doc, opts, onObservationCreated);

    function onObservationCreated(err, docId) {
      if (err) return cb(err);
      var link = {
        type: "observation-link",
        obs: docId,
        link: nodeId
      };
      observationDb.create(link, function(err, linkId) {
        if (err) return cb(err);
        var res = Object.assign(doc, { id: docId });
        var linkRes = Object.assign(link, { id: linkId });
        cb(null, res, linkRes);
      });
    }
  }

  function putObservation(id, geojson, opts, cb) {
    var doc = convert.toOSM(geojson, "observation");
    observationDb.put(id, doc, opts, cb);
  }

  function delObservation(id, opts, cb) {
    observationDb.del(id, opts, cb);
  }

  // TODO: union the query data from both DBs and return
  function query(q, opts, cb) {
    return observationDb.query(q, opts, cb);
  }

  // TODO: union the query data from both DBs and return
  function queryStream(q, opts) {
    return observationDb.queryStream(q, opts);
  }

  // TODO: union the query data from both DBs and return
  function queryGeoJSONStream(q, opts) {
    var osmStream = observationDb.queryStream(q, opts);
    var geoJSONStream = getGeoJSON.obj(observationDb);
    return pump(osmStream, geoJSONStream);
  }

  function clearOsmOrgDb(cb) {
    console.log("1", osmOrgDb.store._id);
    osmOrgDb.clear(function() {
      osmOrgDb = createOsmDb("osm");
      console.log("2", osmOrgDb.store._id);
      netSync = OsmSync(observationDb, osmOrgDb);
      cb();
    });
  }

  function clearAllData(cb) {
    console.log("osm.clearAllData");
    osmOrgDb.clear(onDone);
    observationDb.clear(onDone);

    var pending = 0;
    function onDone(err) {
      if (err) {
        pending = 0;
        cb(err);
      }

      pending++;

      if (pending === 2) {
        return cb();
      }
    }
  }

  function closeAndReopenOsmOrgDb(cb) {
    osmOrgDb.db.close(onDone);
    osmOrgDb.log.db.close(onDone);
    osmOrgDb.store.close(onDone); // TODO: investigate fd-chunk-store (or deferred-chunk-store) not calling its cb on 'close'

    var pending = 3;
    function onDone(err) {
      if (err) {
        pending = Infinity;
        cb(err);
      } else if (--pending === 0) {
        console.log("5", osmOrgDb.store._id);
        osmOrgDb = createOsmDb("osm");
        console.log("6", osmOrgDb.store._id);
        netSync = OsmSync(observationDb, osmOrgDb);
        console.log("closed and reopened osmorgdb");

        osmOrgDb.ready(function() {
          console.log("indexing complete");
          // Less likely to see `Database not open` and `Storage is closed`
          // errors if calling `cb` in the `ready` callback
          cb();
        });
      }
    }
  }

  function replicate(addr, opts, cb) {
    if (!cb && typeof opts === "function") {
      cb = opts;
      opts = {};
    }
    console.log("replicate");
    console.log("0", osmOrgDb.store._id);

    clearOsmOrgDb(function() {
      console.log("3", osmOrgDb.store._id);
      netSync.replicate(addr, opts, function() {
        console.log("4", osmOrgDb.store._id);
        console.log("netSync.replicate finished");

        // TODO: investigate why small AOIs cause `Database not open`
        // and `Storage is closed` errors
        setTimeout(function() {
          closeAndReopenOsmOrgDb(cb);
        }, 1000);
      });
    });
  }

  function findReplicationTargets(opts, cb) {
    OsmSync.findPeers(opts, cb);
  }

  function listAnnotations(q, cb) {
    var stream = queryGeoJSONStream(q).pipe(through.obj(eachFeature));

    function eachFeature(data, enc, next) {
      const type = data.geometry.type.toLowerCase();
      const coordinates = data.geometry.coordinates;

      if (type === "point" && coordinates) {
        this.push({
          id: data.id,
          type: type,
          coordinates: coordinates.reverse(),
          annotationImage: {
            source: {
              uri: "https://cldup.com/7NLZklp8zS.png"
            },
            height: 25,
            width: 25
          }
        });
      }

      next();
    }

    if (cb) {
      return collect(stream, cb);
    }

    return stream;
  }
}

module.exports = osmp2p;
