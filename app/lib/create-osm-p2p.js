const levelup = require("levelup");
const asyncstorage = require("asyncstorage-down");
const hyperlog = require("hyperlog");
const osmdb = require("osm-p2p-db");

const createStore = require("./asyncstorage-chunk-store");

function createOsmDb(prefix) {
  const logdb = levelup(prefix + "-db", { db: asyncstorage });
  const log = hyperlog(logdb, { valueEncoding: "json" });

  var db = osmdb({
    log: log,
    db: levelup(prefix + "-index", { db: asyncstorage }),
    store: createStore(1024, prefix + "-chunks")
  });

  db.clear = function(cb) {
    var pending = 3;
    asyncstorage.destroy(prefix + "-db", onDone);
    asyncstorage.destroy(prefix + "-index", onDone);
    store.destroy(onDone);

    function onDone() {
      if (--pending === 0) db();
    }
  };

  return db;
}

module.exports = createOsmDb;
