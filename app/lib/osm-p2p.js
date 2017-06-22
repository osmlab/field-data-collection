const levelup = require("levelup");
const asyncstorage = require("asyncstorage-down");
const hyperlog = require("hyperlog");
const osmdb = require("osm-p2p-db");
const eos = require("end-of-stream");
const getGeoJSON = require("osm-p2p-geojson");
const pump = require("pump");
const collect = require("collect-stream");
const through = require("through2");

const createStore = require("./asyncstorage-chunk-store");
const convert = require("./convert-geojson-osmp2p");

function osmp2p() {
  const logdb = levelup("db", { db: asyncstorage });
  const log = hyperlog(logdb, { valueEncoding: "json" });

  var osm = osmdb({
    log: log,
    db: levelup("index", { db: asyncstorage }),
    store: createStore(1024, "chunks")
  });

  return {
    db: osm,
    ready,
    create,
    put,
    del,
    createObservation,
    putObservation,
    delObservation,
    query,
    queryGeoJSONStream,
    replicate,
    sync,
    createAnnotationStream
  };

  osm.on("error", console.log);

  function ready(cb) {
    osm.ready(cb);
  }

  function create(geojson, opts, cb) {
    var doc = convert.toOSM(geojson);
    osm.create(doc, opts, cb);
  }

  function put(id, geojson, opts, cb) {
    var doc = convert.toOSM(geojson);
    osm.put(id, doc, opts, cb);
  }

  function del(id, opts, cb) {
    osm.del(id, opts, cb);
  }

  function createObservation(geojson, opts, cb) {
    var doc = convert.toOSM(geojson, "observation");
    osm.create(doc, opts, cb);
  }

  function putObservation(id, geojson, opts, cb) {
    var doc = convert.toOSM(geojson, "observation");
    osm.put(id, doc, opts, cb);
  }

  function delObservation(id, opts, cb) {
    osm.del(id, opts, cb);
  }

  function query(q, opts, cb) {
    return osm.query(q, opts, cb);
  }

  function queryStream(q, opts) {
    return osm.queryStream(q, opts);
  }

  function queryGeoJSONStream(q, opts) {
    var osmStream = osm.queryStream(q, opts);
    var geoJSONStream = getGeoJSON.obj(osm);
    return pump(osmStream, geoJSONStream);
  }

  function replicate(opts) {
    return osm.log.replicate(opts);
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

  function createAnnotationStream(q, cb) {
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
