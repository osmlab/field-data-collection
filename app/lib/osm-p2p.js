const levelup = require("levelup");
const asyncstorage = require("asyncstorage-down");
const hyperlog = require("hyperlog");
const osmdb = require("osm-p2p-db");

const createStore = require("./asyncstorage-chunk-store");
const convert = require("./convert-geojson-osmp2p");

function osmp2p() {
  const logdb = levelup("db", { db: asyncstorage });
  const log = hyperlog(logdb, { valueEncoding: "json" });

  var db = osmdb({
    log: log,
    db: levelup("index", { db: asyncstorage }),
    store: createStore(1024, "chunks")
  });

  return {
    ready: ready,
    create: create,
    put: put,
    del: del,
    createObservation: createObservation,
    putObservation: putObservation,
    delObservation: delObservation,
    query: query,
    replicate: replicate
  };

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

  function replicate(opts) {
    return db.log.replicate(opts);
  }
}

export default osmp2p;
