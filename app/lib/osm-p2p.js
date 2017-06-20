const levelup = require("levelup");
const asyncstorage = require("asyncstorage-down");
const hyperlog = require("hyperlog");
const osmdb = require("osm-p2p-db");
const eos = require("end-of-stream");
const getGeoJSON = require("osm-p2p-geojson");
const pump = require("pump");
const OsmSync = require("./osm-sync");

const createStore = require("./asyncstorage-chunk-store");
const convert = require("./convert-geojson-osmp2p");

function createOsmDb (prefix) {
  const logdb = levelup(prefix + "-db", { db: asyncstorage });
  const log = hyperlog(logdb, { valueEncoding: "json" });

  return osmdb({
    log: log,
    db: levelup(prefix + "-index", { db: asyncstorage }),
    store: createStore(1024, prefix + "-chunks")
  });
}

function osmp2p() {
  var observationDb = createOsmDb('observations')
  var osmOrgDb = createOsmDb('osmorg')

  var netSync = OsmSync(observationDb, osmOrgDb)

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
    observationDb.ready(onReady);
    osmOrgDb.ready(onReady);

    var pending = 2
    function onReady() {
      if (--pending === 0) cb()
    }
  }

  function create(geojson, opts, cb) {
    var doc = convert.toOSM(geojson);
    observationDb.create(doc, opts, cb);
  }

  function put(id, geojson, opts, cb) {
    var doc = convert.toOSM(geojson);
    observationDb.put(id, doc, opts, cb);
  }

  function del(id, opts, cb) {
    observationDb.del(id, opts, cb);
  }

  function createObservation(geojson, opts, cb) {
    var doc = convert.toOSM(geojson, "observation");
    osm.create(doc, opts, cb);
    observationDb.create(doc, opts, cb);
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

  function queryStream(q, opts) {
    return osm.queryStream(q, opts);
  }

  function queryGeoJSONStream(q, opts) {
    var osmStream = osm.queryStream(q, opts);
    var geoJSONStream = getGeoJSON.obj(osm);
    return pump(osmStream, geoJSONStream);
  }

  function replicate(opts) {
    return observationDb.log.replicate(opts);
  }

  function replicateNet(addr, opts, cb) {
    netSync.replicate(addr, opts, cb)
  }

  function findReplicationTargets(opts, cb) {
    netSync.findPeers(opts, cb)
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
}

export default osmp2p;
