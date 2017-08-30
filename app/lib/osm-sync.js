var Bonjour = require("bonjour");
var websocket = require("websocket-stream");
var eos = require("end-of-stream");
const osmImportXml = require("./osm-import");

module.exports = OsmSync;

function noop() {}

function OsmSync(observationDb, osmOrgDb) {
  if (!(this instanceof OsmSync)) return new OsmSync(observationDb, osmOrgDb);

  this.observationDb = observationDb;
  this.osmOrgDb = osmOrgDb;
}

OsmSync.prototype.replicate = function(target, opts, done) {
  if (typeof opts === "function" && !done) {
    done = opts;
    opts = {};
  }
  opts = opts || {};
  opts.progressFn = opts.progressFn || noop;
  done = done || noop;

  var finished = 0;
  this.replicateObservationDb(target, onFinish);
  this.replicateOsmOrgDb(target, onFinish);

  opts.progressFn(0);

  function onFinish(err) {
    console.log("onFinish", finished);
    if (err) {
      finished--;
      return done(err);
    }

    opts.progressFn(++finished / 2);

    if (finished === 2) {
      console.log("finished replicating", finished);
      return done();
    }
  }
};

OsmSync.prototype.replicateObservationDb = function(target, done) {
  var socket = websocket(
    "ws://" + target.address + ":" + target.port + "/replicate/observations"
  );
  var rs = this.observationDb.log.createReplicationStream();
  replicate(socket, rs, done);
};

// Assumes you have a wiped, fresh DB
OsmSync.prototype.replicateOsmOrgDb = function(target, done) {
  console.log("start replicateOsmOrgDb");
  // Import fresh XML
  var socket = websocket(
    "ws://" + target.address + ":" + target.port + "/replicate/osm"
  );
  osmImportXml(this.osmOrgDb, socket, done);
};

OsmSync.findPeers = function(opts, done) {
  if (typeof opts === "function" && !done) {
    done = opts;
    opts = {};
  }
  opts = opts || {};
  opts.timeout = opts.timeout || 5000;
  done = done || noop;

  var bonjour = Bonjour();
  var peer = null;
  var browser = bonjour.findOne({ type: "osm-sync" }, onPeer);
  setTimeout(onTimeout, opts.timeout);

  function onPeer(info) {
    console.log("Found an osm-sync peer", info);
    peer = {
      address: info.addresses[0],
      port: info.port
    };
    browser.stop();
    done(null, [peer]);
  }

  function onTimeout() {
    if (!peer) {
      console.log("Found no osm-sync peers");
      browser.stop();
      done(null, []);
    }
  }
};

function replicate(a, b, done) {
  eos(a, onDone);
  a.on("close", onDone);
  eos(b, onDone);
  b.on("close", onDone);

  a.pipe(b).pipe(a);

  var pending = 2;
  function onDone(err) {
    if (err) {
      pending++;
      return done(err);
    }
    if (--pending === 0) done();
  }
}
