#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const http = require("http");
const level = require("level-party");
const osmdb = require("osm-p2p");
const obsdb = require("osm-p2p-observations");
const mkdirp = require("mkdirp");
const websocket = require("websocket-stream");
const importer = require("osm-p2p-db-importer");

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

    osm.log.createReadStream().on("data", function(data) {
      console.log("data", data);
    });
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

    var stream = osm.log.replicate();
    socket.pipe(stream).pipe(socket);
    stream.on("data", console.log);

    socket.on("end", function() {
      console.log("done importing");

      osm.log.createReadStream().on("data", function(data) {
        console.log("data", data);
      });
    });
  }

  server.listen(3000, function() {
    console.log("server listening at http://127.0.0.1:3000");
  });
}
