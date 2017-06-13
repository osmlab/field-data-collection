#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var http = require("http");
var level = require("level");
var osmdb = require("osm-p2p");
var obsdb = require("osm-p2p-observations");
var mkdirp = require("mkdirp");
var websocket = require("websocket-stream");
var hyperlog = require("hyperlog");

var dir = path.join(__dirname, "tmp", "db");

fs.stat(dir, function(err, stats) {
  if (err) {
    mkdirp.sync(dir);
    createDB(dir, importData(start));
  } else {
    createDB(dir, start);
  }
});

function createDB(dir, callback) {
  var db = level(path.join(dir, "obs.db"));
  var osm = osmdb(path.join(dir, "osm.db"));
  var obs = obsdb({ db: db, log: osm.log });
  osm.ready(function() {
    callback(osm);
  });
}

function importData(callback) {
  return function(osm) {
    callback(osm);
  };
}

function start(osm) {
  var server = http.createServer();
  server.on("request", function(req) {
    console.log("req", req.url);
  });

  var log = hyperlog(level(path.join(__dirname, "tmp", "db")));

  var wss = websocket.createServer(
    {
      perMessageDeflate: false,
      server: server
    },
    handleSocket
  );

  function handleSocket(socket) {
    console.log("handleSocket");

    var stream = osm.log.replicate();
    socket.pipe(stream).pipe(socket);
    stream.on("data", console.log);

    socket.on("end", function() {
      console.log("done");
      osm.log.createReadStream().on("data", console.log);
    });
  }

  server.listen(3131, function() {
    console.log("server listening at http://127.0.0.1:3131");
  });
}
