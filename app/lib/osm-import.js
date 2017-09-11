var osm2Obj = require("osm2json");
var randomBytes = require("randombytes");
var through = require("through2");

module.exports = importify;

function importify(osm, xmlStream, done) {
  var batch = [];
  var idToP2pId = {};

  var pending = [];

  var t = through.obj(write, flush);
  var r = xmlStream.pipe(osm2Obj({ coerceIds: false })).pipe(t);

  t.on("end", function() {
    done();
  });

  function write(change, enc, next) {
    if (
      change.type !== "node" &&
      change.type !== "way" &&
      change.type !== "relation"
    )
      return next();

    // skip unnamed + nnn-node features
    if (
      change.type !== "node" ||
      change.tags == null ||
      change.tags.name == null
    ) {
      return next();
    }

    idToP2pId[change.id] = hex2dec(randomBytes(8).toString("hex")).toString();
    if (!isSatisfiable(change)) {
      pending.push(change);
      return next();
    }

    writeChange(change);
    next();
  }

  function flush(fin) {
    pending.forEach(writeChange);

    osm.batch(batch, function(err) {
      if (err) return fin(err);
      else drain();

      function drain(err) {
        t.resume(); // drain stream to induce 'end' event
        fin(err);
      }
    });
  }

  function writeChange(change) {
    var kv = batchMap(change);
    batch.push({
      type: "put",
      key: kv.k,
      value: kv.v
    });
  }

  function isSatisfiable(change) {
    return (
      (change.nodes || []).every(id => idToP2pId[id] != null) &&
      (change.members || []).every(({ ref }) => idToP2pId[ref] != null)
    );
  }

  /**
  * Turn a changeset operation into a osm-p2p-db batch operation
  */
  function batchMap(change) {
    var op = {
      type: change.action === "delete" ? "del" : "put",
      key: change.id,
      value: {}
    };
    if (change.action !== "create" && change.version) {
      op.links = change.version.split(/\s*,\s*/).filter(Boolean);
    }
    Object.keys(change).forEach(function(prop) {
      if (SKIP_PROPS.indexOf(prop) > -1) return;
      op.value[prop === "nodes" ? "refs" : prop] = change[prop];
    });
    op.value.timestamp = op.value.timestamp || new Date().toISOString();

    var key = idToP2pId[change.id];
    (change.nodes || []).forEach(function(id, idx) {
      op.value.refs[idx] = idToP2pId[id];
      // console.log('fixed ref mapping', id, 'to', op.value.refs[idx])
    });
    (change.members || []).forEach(function(ref, idx) {
      ref.ref = idToP2pId[ref.ref];
      op.value.members[idx] = ref;
      // console.log('fixed member mapping', ref.ref, 'to', op.value.members[idx])
    });

    // filter out nulls
    if (op.value.refs)
      op.value.refs = op.value.refs.filter(function(id) {
        return !!id;
      });
    if (op.value.members)
      op.value.members = op.value.members.filter(function(ref) {
        return !!ref.ref;
      });

    return {
      k: key,
      v: op.value
    };
  }
}

function hex2dec(h) {
  return parseInt(h, 16);
}

var SKIP_PROPS = ["action", "id", "version", "ifUnused", "old_id"];
