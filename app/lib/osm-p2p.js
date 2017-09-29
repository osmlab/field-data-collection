const EventEmitter = require("events");

const getGeoJSON = require("osm-p2p-geojson");
const pump = require("pump");
const DeviceInfo = require("react-native-device-info");
const OsmSync = require("./osm-sync");
const generatePlaceholderOsmId = require("./generate-id");
const convert = require("./convert-geojson-osmp2p");
const obs = require("./observations");

function osmp2p(createOsmDb) {
  var observationDb = createOsmDb("obs");
  var osmOrgDb = createOsmDb("osm");

  var netSync = OsmSync(observationDb, osmOrgDb);

  observationDb.on("error", console.log);
  osmOrgDb.on("error", console.log);

  var emitter = Object.assign(new EventEmitter(), {
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
    sync: netSync,
    getObservationsByDeviceId,
    getObservationsBySurveyId
  });

  return emitter;

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

    doc.tags = doc.tags || {};
    const nodeId = doc.tags["osm-p2p-id"];

    doc.tags.deviceId = DeviceInfo.getUniqueID();
    doc.timestamp = new Date().toISOString();
    doc.type = "observation";

    observationDb.create(doc, opts, onObservationCreated);

    function onObservationCreated(err, docId) {
      if (err) return cb(err);
      var res = Object.assign(doc, { id: docId });

      // create a link to an osm feature only if applicable
      if (nodeId) {
        var link = {
          type: "observation-link",
          obs: docId,
          link: nodeId
        };

        return observationDb.create(link, function(err, linkId) {
          if (err) return cb(err);
          var linkRes = Object.assign(link, { id: linkId });
          cb(null, res, linkRes);
        });
      }

      cb(null, res);
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

  function replicate(addr, opts, cb) {
    if (!cb && typeof opts === "function") {
      cb = opts;
      opts = {};
    }

    setImmediate(function() {
      emitter.emit("replicating");
      console.log("start replication");
      netSync.replicate(addr, opts, function() {
        emitter.emit("replication-done");
        console.log("start index regen");
        console.log("start indexing");
        emitter.emit("indexing");
        osmOrgDb.ready(function() {
          emitter.emit("indexing-done");
          console.log("indexing complete");

          emitter.emit("change");
        });
        cb();
      });
    });
  }

  function findReplicationTargets(opts, cb) {
    OsmSync.findPeers(opts, cb);
  }

  function getObservationsByDeviceId(deviceId, cb) {
    return obs.getObservationsByDeviceId(deviceId, observationDb, cb);
  }

  function getObservationsBySurveyId(surveyId, cb) {
    return obs.getObservationsBySurveyId(surveyId, observationDb, cb);
  }
}

module.exports = osmp2p;
