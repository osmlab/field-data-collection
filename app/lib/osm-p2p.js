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
    sync,
    listAnnotations,
    clearAllData
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
  function createObservation(nodeId, doc, opts, cb) {
    if (!cb && typeof opts === "function") {
      cb = opts;
      opts = {};
    }

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
    osmOrgDb.clear(function() {
      osmOrgDb = createOsmDb("osm");
      netSync = OsmSync(observationDb, osmOrgDb);
      cb();
    });
  }

  function clearAllData(cb) {
    console.log("osm.clearAllData");
    osmOrgDb.clear(onDone);
    observationDb.clear(onDone);

    var pending = 2;
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
    osmOrgDb.store.close(); // TODO: investigate fd-chunk-store (or deferred-chunk-store) not calling its cb on 'close'

    var pending = 2;
    function onDone(err) {
      if (err) {
        pending = Infinity;
        cb(err);
      } else if (--pending === 0) {
        console.log("closed and reopened osmorgdb");
        cb();
      }
    }
  }

  function replicate(addr, opts, cb) {
    if (!cb && typeof opts === "function") {
      cb = opts;
      opts = {};
    }
    console.log("replicate");
    clearOsmOrgDb(function() {
      osmOrgDb = createOsmDb("osm");
      netSync.replicate(addr, opts, function() {
        console.log("netSync.replicate finished");
        closeAndReopenOsmOrgDb(function() {
          osmOrgDb = createOsmDb("osm");
          netSync = OsmSync(observationDb, osmOrgDb);
          cb();
        });
      });
    });
  }

  function findReplicationTargets(opts, cb) {
    OsmSync.findPeers(opts, cb);
  }

  function sync(transportStream, opts, callback) {
    if (typeof opts === "function") {
      callback = opts;
      opts = null;
    }

    console.log("sync: start");
    var osmStream = replicate(opts);

    eos(osmStream, done);
    eos(transportStream, done);
    transportStream.on("close", done);

    let pending = 2;
    function done(err) {
      if (err) return callback(err);
      if (--pending === 0) {
        console.log("sync: end");
        callback();
      }
    }

    return transportStream.pipe(osmStream).pipe(transportStream);
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
