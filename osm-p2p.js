const levelup = require("levelup");
const asyncstorage = require("asyncstorage-down");
const hyperlog = require("hyperlog");
const osmdb = require("osm-p2p-db");
const createStore = require("./app/lib/asyncstorage-chunk-store");

function osmp2p() {
  const logdb = levelup("db", { db: asyncstorage });
  const log = hyperlog(logdb, { valueEncoding: "json" });

  return osmdb({
    log: log,
    db: levelup("index", { db: asyncstorage }),
    store: createStore(1024, "chunks")
  });
}

export default osmp2p;
