const getGeoJSON = require("osm-p2p-geojson");
const pump = require("pump");
const collect = require("collect-stream");
const through = require("through2");
const DeviceInfo = require("react-native-device-info");
const OsmSync = require("./osm-sync");
const generatePlaceholderOsmId = require("./generate-id");
const convert = require("./convert-geojson-osmp2p");
const observationsByDeviceId = require("./observations")
  .getObservationsByDeviceId;

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
    queryObservations,
    queryOSM,
    queryGeoJSONStream,
    replicate,
    findReplicationTargets,
    clearAllData,
    sync: netSync,
    getObservationsByDeviceId
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

  function createObservation(doc, opts, cb) {
    if (!cb && typeof opts === "function") {
      cb = opts;
      opts = {};
    }

    console.log("doc", doc);
    doc.tags = doc.tags || {};
    const nodeId = doc.tags["osm-p2p-id"];

    doc.tags.deviceId = DeviceInfo.getUniqueID();
    doc.timestamp = new Date().toISOString();
    doc.type = "observation";

    observationDb.create(doc, opts, onObservationCreated);

    function onObservationCreated(err, docId) {
      if (err) return cb(err);

      // create a link to an osm feature only if applicable
      if (nodeId) {
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
  }

  function putObservation(id, geojson, opts, cb) {
    var doc = convert.toOSM(geojson, "observation");
    observationDb.put(id, doc, opts, cb);
  }

  function delObservation(id, opts, cb) {
    observationDb.del(id, opts, cb);
  }

  // TODO: union the query data from both DBs and return
  function queryObservations(q, opts, cb) {
    return observationDb.query(q, opts, cb);
  }

  // TODO: union the query data from both DBs and return
  function queryOSM(q, opts, cb) {
    return osmOrgDb.query(q, opts, cb);
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
    osmOrgDb.clear(cb);
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

  // Reach into an osm-p2p-db and reset all of its indexes, causing a full
  // re-index of its data.
  function resetIndexes(osm, cb) {
    osm.kdb.dex.db.put("seq", 0, done);
    osm.refs.dex.db.put("seq", 0, done);
    osm.changeset.dex.db.put("seq", 0, done);

    var pending = 3;
    function done(err) {
      if (err) pending++ && cb(err);
      if (!--pending) cb();
    }
  }

  function pauseIndexes(osm) {
    osm.kdb.dex.pause();
    osm.refs.dex.pause();
    osm.changeset.dex.pause();
  }

  function replicate(addr, opts, cb) {
    if (!cb && typeof opts === "function") {
      cb = opts;
      opts = {};
    }

    console.log("pauseIndexes");
    pauseIndexes(osmOrgDb);
    process.nextTick(function() {
      console.log("clearOsmOrgDb");
      clearOsmOrgDb(function() {
        console.log("start replication");
        netSync.replicate(addr, opts, function() {
          console.log("resetIndexes");
          resetIndexes(osmOrgDb, function() {
            console.log("restartIndexes");
            osmOrgDb._restartIndexes();
            osmOrgDb.ready(function() {
              console.log("indexes complete");
            });
            cb();
          });
        });
      });
    });
  }

  function findReplicationTargets(opts, cb) {
    OsmSync.findPeers(opts, cb);
  }

  function getObservationsByDeviceId(deviceId, cb) {
    return observationsByDeviceId(deviceId, observationDb, cb);
  }
}

module.exports = osmp2p;
