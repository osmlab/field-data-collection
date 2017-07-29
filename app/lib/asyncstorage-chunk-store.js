var AsyncStorage = require("react-native").AsyncStorage;
var d64 = require("d64");

module.exports = Storage;

function Storage(chunkLength, opts) {
  if (!(this instanceof Storage)) return new Storage(chunkLength, opts);

  this._id = Math.random().toString().substring(5);

  if (typeof opts === "string") {
    var prefix = opts;
    opts = {};
    opts.prefix = prefix;
  }

  if (!opts) opts = {};

  this.chunkLength = Number(chunkLength);
  if (!this.chunkLength)
    throw new Error("First argument must be a chunk length");

  this.chunks = [];
  this.closed = false;
  this.length = Number(opts.length) || Infinity;

  if (this.length !== Infinity) {
    this.lastChunkLength = this.length % this.chunkLength || this.chunkLength;
    this.lastChunkIndex = Math.ceil(this.length / this.chunkLength) - 1;
  }

  this._store = AsyncStorage;
  this._prefix = opts.prefix ? "!" + opts.prefix + "!" : "!chunks!";
}

Storage.prototype.put = function(index, buf, cb) {
  if (this.closed) return nextTick(cb, new Error("Storage is closed"));

  var isLastChunk = index === this.lastChunkIndex;

  if (isLastChunk && buf.length !== this.lastChunkLength) {
    return nextTick(
      cb,
      new Error("Last chunk length must be " + this.lastChunkLength)
    );
  }

  if (!isLastChunk && buf.length !== this.chunkLength) {
    return nextTick(cb, new Error("Chunk length must be " + this.chunkLength));
  }

  var key = this._prefix + String(index);
  var val = d64.encode(buf);

  this._store.setItem(key, val, cb);
};

Storage.prototype.get = function(index, opts, cb) {
  if (typeof opts === "function") return this.get(index, null, opts);
  if (this.closed) return nextTick(cb, new Error("Storage is closed"));
  opts = opts || {};

  var key = this._prefix + String(index);

  this._store.getItem(key, function(err, val) {
    if (err) return cb(new Error("Chunk not found"));
    if (!val) return cb(null, "");
    var buf = d64.decode(val);
    var offset = opts.offset || 0;
    var len = opts.length || buf.length - offset;
    cb(null, buf.slice(offset, len + offset));
  });
};

Storage.prototype.close = function(cb) {
  if (this.closed) return nextTick(cb, new Error("Storage is closed"));

  this.closed = true;
  return process.nextTick(cb);
};

Storage.prototype.clear = function(cb) {
  if (this.closed) return nextTick(cb, new Error("Storage is closed"));

  var prefix = this._prefix;
  var prefixLen = this._prefix.length;

  AsyncStorage.getAllKeys(function(err, keys) {
    if (err) return cb(err);

    keys = keys.filter(function(key) {
      return key.slice(0, prefixLen) === prefix;
    });

    if (!keys.length) return cb();

    AsyncStorage.multiRemove(keys, cb);
  });
};

Storage.prototype.destroy = function(cb) {
  if (this.closed) return nextTick(cb, new Error("Storage is closed"));

  var self = this;

  this.close(() => {
    self.clear(cb);
  });
};

function nextTick(cb, err, val) {
  process.nextTick(function() {
    if (cb) cb(err, val);
  });
}
