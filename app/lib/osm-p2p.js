const levelup = require("levelup");
const asyncstorage = require("asyncstorage-down");
const hyperlog = require("hyperlog");
const osmdb = require("osm-p2p-db");
const eos = require("end-of-stream");
const getGeoJSON = require("osm-p2p-geojson");
const pump = require("pump");

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
    sync
  };

  osm.on("error", console.log);

  function ready(cb) {
    db.ready(cb);
  }

  function create(geojson, opts, cb) {
    var doc = convert.toOSM(geojson);
    db.create(doc, opts, cb);
  }

  function put(id, geojson, opts, cb) {
    var doc = convert.toOSM(geojson);
    db.put(id, doc, opts, cb);
  }

  function del(id, opts, cb) {
    db.del(id, opts, cb);
  }

  function createObservation(geojson, opts, cb) {
    var doc = convert.toOSM(geojson, "observation");
    db.create(doc, opts, cb);
  }

  function putObservation(id, geojson, opts, cb) {
    var doc = convert.toOSM(geojson, "observation");
    db.put(id, doc, opts, cb);
  }

  function delObservation(id, opts, cb) {
    db.del(id, opts, cb);
  }

  function query(q, opts, cb) {
    return db.query(q, opts, cb);
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
    return db.log.replicate(opts);
  }

  function sync(transportStream, opts, callback) {
    if (typeof opts === "function") {
      callback = opts;
      opts = null;
    }

    console.log("sync: start");
    var osmStream = replicate(opts);

    eos(osmStream, function(err) {
      if (err) return console.log("osmStream error", err);
      console.log("osm stream ended");
      callback();
    });
    eos(transportStream, function(err) {
      if (err) return console.log("transportStream error", err);
      console.log("transport stream ended");
      callback();
    });

    transportStream.on("data", d => {
      console.log(d.toString());
    });

    return transportStream.pipe(osmStream).pipe(transportStream);
  }
}

export default osmp2p;
