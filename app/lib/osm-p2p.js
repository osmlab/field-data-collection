const eos = require("end-of-stream");
const getGeoJSON = require("osm-p2p-geojson");
const pump = require("pump");
const collect = require("collect-stream");
const through = require("through2");
const OsmSync = require("./osm-sync");
const generatePlaceholderOsmId = require("./generate-id");
const convert = require("./convert-geojson-osmp2p");

function osmp2p(observationDb, osmOrgDb) {
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
    sync,
    listAnnotations
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
    if (!doc.tags) doc.tags = {}
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

  function createObservation(nodeId, geojson, opts, cb) {
    var doc = convert.toOSM(geojson, "observation");
    observationDb.create(doc, opts, onObservationCreated);

    function onObservationCreated(err, newDoc) {
      if (err) return cb(err);
      var link = {
        type: "observation-link",
        obs: newDoc.id,
        link: nodeId
      };
      observationDb.put(link, function(err, newLink) {
        if (err) cb(err);
        else cb(null, newDoc);
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

  function replicate(opts) {
    return observationDb.log.replicate(opts);
  }

  function replicateNet(addr, opts, cb) {
    netSync.replicate(addr, opts, cb);
  }

  function findReplicationTargets(opts, cb) {
    netSync.findPeers(opts, cb);
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

export default osmp2p;
