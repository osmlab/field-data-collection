var test = require("tape");
var osmdb = require("osm-p2p-mem");
var obsdb = require("osm-p2p-observations");
var memdb = require("memdb");
var helpers = require("../app/lib/observations");
var forEach = require("async").forEach;

test("get observations by node", function(t) {
  // Set up a new test db
  var observationsDb = osmdb();
  var observationsIndex = obsdb({ db: memdb(), log: observationsDb.log });

  var docs = {
    A: {
      type: "observation",
      lat: 1,
      lon: 1
    },
    B: {
      type: "observation",
      lat: 2,
      lon: 2
    },
    C: {
      type: "observation-link",
      link: "E",
      obs: "A"
    },
    D: {
      type: "observation-link",
      link: "E",
      obs: "B"
    }
  };

  forEach(Object.keys(docs).sort(), insertDoc, checkObservations);

  function insertDoc(docId, cb) {
    observationsDb.put(docId, docs[docId], cb);
  }

  function checkObservations(err) {
    t.error(err);

    helpers.getObservationsByNode(
      "E",
      observationsDb,
      observationsIndex,
      function(err, res) {
        t.error(err);
        var expected = [
          { lat: 1, lon: 1, type: "observation" },
          { lat: 2, lon: 2, type: "observation" }
        ];
        t.deepEqual(res, expected);
        t.end();
      }
    );
  }
});

test("get observations by survey id, device id", function(t) {
  // Set up a new test db
  var observationsDb = osmdb();

  var docs = {
    A: {
      type: "observation",
      lat: 1,
      lon: 1,
      tags: {
        surveyId: "123",
        deviceId: "dead"
      }
    },
    B: {
      type: "observation",
      lat: 2,
      lon: 2,
      tags: {
        surveyId: "200",
        deviceId: "beef"
      }
    },
    C: {
      type: "observation",
      lat: 3,
      lon: 3
    }
  };

  forEach(Object.keys(docs).sort(), insertDoc, checkObservations);

  function insertDoc(docId, cb) {
    observationsDb.put(docId, docs[docId], cb);
  }

  function checkObservations(err) {
    t.error(err);

    helpers.getObservationsBySurveyId("123", observationsDb, function(
      err,
      res
    ) {
      t.error(err);
      t.equal(res.length, 1);
      var expected = [docs.A];
      delete res[0].version;
      delete res[0].id;
      t.deepEqual(res, expected);

      helpers.getObservationsByDeviceId("beef", observationsDb, function(
        err,
        res
      ) {
        t.error(err);
        t.equal(res.length, 1);
        var expected = [docs.B];
        delete res[0].version;
        delete res[0].id;
        t.deepEqual(res, expected);

        t.end();
      });
    });
  }
});
