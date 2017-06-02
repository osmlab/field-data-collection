const levelup = require("levelup");
const asyncstorage = require("asyncstorage-down");
const hyperlog = require("hyperlog");
const osmdb = require("osm-p2p-db");
const createStore = require("./lib/asyncstorage-chunk-store");

function osmp2p() {
  var ext = ("" + Math.random()).substring(2, 8);
  const logdb = levelup("db" + ext, { db: asyncstorage });
  const log = hyperlog(logdb, { valueEncoding: "json" });

  //  idxdb.readStream().on('data', data => { console.log('idx:', data) })
  //  logdb.readStream().on('data', data => { console.log('log:', data) })

  return osmdb({
    log: log,
    db: levelup("index" + ext, { db: asyncstorage }),
    store: createStore(1024, "chunks" + ext)
  });
}

export default osmp2p;
