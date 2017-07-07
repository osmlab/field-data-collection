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
    console.log('db.clear: 1')
    var pending = 3;
    asyncstorage.destroy(prefix + "-db", onDone.bind(this, 'db'));
    asyncstorage.destroy(prefix + "-index", onDone.bind(this, 'index'));
    store.destroy(onDone.bind(this, 'chunk-store'));

    function onDone(type) {
      console.log('db.clear: 2; pending ===', pending, 'type ===', type)
      if (--pending === 0) db();
    }
  };

  return db;
}

module.exports = createOsmDb;
