#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const maki = require("maki");
const reader = require("folder-reader");
const through = require("through2");
const svg2png = require("svg2png");

const imgDir = path.join(__dirname, "..", "app", "img", "maki");

reader(path.join(maki.dirname, "icons")).pipe(mapFiles());

function mapFiles() {
  return through.obj(function(data, enc, next) {
    if (data.type !== "file") return next();
    console.log("read", data.relname);
    writeFile(data, function(err) {
      if (err) console.log(err);
      console.log("write:end", data.relname);
      next();
    });
  });
}

function writeFile(data, callback) {
  console.log("write:start", data.relname);
  svg2png(data.file)
    .then(buffer => {
      var filename = data.relname.replace(".svg", ".png");
      var filepath = path.join(imgDir, filename);
      fs.writeFile(filepath, buffer, callback);
    })
    .catch(callback);
}
