#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const http = require("http");
const level = require("level");
const osmdb = require("osm-p2p");
const obsdb = require("osm-p2p-observations");
const mkdirp = require("mkdirp");
const websocket = require("websocket-stream");
const importer = require("osm-p2p-db-importer");
const eos = require("end-of-stream");

/*
* A server for importing data into the app during development
*/

var dir = path.join(__dirname, "tmp", "db", "osm");

fs.stat(dir, function(err, stats) {
  console.log(err);
  if (err && err.code === "ENOENT") {
    mkdirp.sync(dir);

    importData(function(err) {
      if (err) throw err;
      console.log("import finished");
      var db = createDB(dir);
      start(db);
    });
  } else {
    var db = createDB(dir);
    start(db);
  }
});

function createDB(dir, callback) {
  var db = level(path.join(dir, "obs"));
  var osm = osmdb(dir);
  var obs = obsdb({ db: db, log: osm.log });
  return osm;
}

function importData(callback) {
  console.log("import started");
  var file = path.join(__dirname, "..", "example-data.xml");
  var xml = fs.createReadStream(file);
  importer(path.join(dir), xml, callback);
}

function start(osm) {
  var server = http.createServer();

  osm.ready(function() {
    console.log("ready");
  });

  var wss = websocket.createServer(
    {
      perMessageDeflate: false,
      server: server
    },
    handleSocket
  );

  function handleSocket(socket) {
    console.log("sync with mobile app started");
    let pending = 2;

    var stream = osm.log.replicate();
    socket.pipe(stream).pipe(socket);
    stream.on("data", console.log);

    eos(stream, done);
    eos(socket, done);

    function done(err) {
      if (err) throw err;
      if (--pending === 0) {
        console.log("done importing");
      }
    }
  }

  server.listen(3000, function() {
    console.log("server listening at http://127.0.0.1:3000");
  });
}
