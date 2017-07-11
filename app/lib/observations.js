const amap = require("async").map;
const through = require("through2");
const concat = require("concat-stream");

module.exports = {
  getObservationsByNode,
  getObservationsBySurveyId,
  getObservationsByDeviceId
};

function getObservationsByNode(nodeId, observationsDb, observationsIndex, cb) {
  observationsIndex.links(nodeId, function(err, docs) {
    if (err) return cb(err);

    amap(docs, observationLinkToObservation, function(err, res) {
      if (err) return cb(err);
      res = res.filter(item => !!item);
      cb(null, res);
    });

    function observationLinkToObservation(link, done) {
      var obsId = link.value.obs;
      observationsDb.get(obsId, function(err, heads) {
        if (err) return done(err);
        var doc = flattenHeads(heads);
        done(null, doc);
      });
    }
  });
}

function getObservationsBySurveyId(surveyId, observationsDb, cb) {
  filterAllDocuments(observationsDb, match, cb);

  function match(doc) {
    return (
      doc.tags &&
      doc.tags.surveyId &&
      doc.tags.surveyId.toString() === surveyId.toString()
    );
  }
}

function getObservationsByDeviceId(deviceId, observationsDb, cb) {
  filterAllDocuments(observationsDb, match, cb);

  function match(doc) {
    return (
      doc.tags &&
      doc.tags.deviceId &&
      doc.tags.deviceId.toString() === deviceId.toString()
    );
  }
}

function filterAllDocuments(observationsDb, filterFn, cb) {
  var q = observationsDb.queryStream([[-90, 90], [-180, 180]]);
  var t = through.obj(write);
  var sink = concat({ encoding: "object" }, onValues);

  q.pipe(t).pipe(sink);

  function onValues(values) {
    cb(null, values);
  }

  function write(doc, _, next) {
    if (filterFn(doc)) {
      this.push(doc);
    }
    next();
  }
}

function flattenHeads(heads) {
  var keys = Object.keys(heads);
  if (keys.length === 0) return null;
  return values(heads).sort(cmpFork)[0];
}

function values(obj) {
  return Object.keys(obj).map(k => obj[k]);
}

/**
 * Sort function to sort forks by most recent first, or by version id
 * if no timestamps are set
 */
function cmpFork(a, b) {
  if (a.timestamp && b.timestamp) {
    if (a.timestamp > b.timestamp) return -1;
    if (a.timestamp < b.timestamp) return 1;
    return 0;
  }
  if (a.timestamp) return -1;
  if (b.timestamp) return 1;
  // Ensure sorting is stable between requests
  return a.version < b.version ? -1 : 1;
}
