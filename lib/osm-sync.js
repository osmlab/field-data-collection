var Bonjour = require('bonjour')

module.exports = OsmSync

function noop () {}

function OsmSync (observationsDb, cacheDb) {
  if (!(this instanceof OsmSync)) return new OsmSync(observationsDb, cacheDb)

  this.observations = observationsDb
  this.cache = cacheDb
}

OsmSync.prototype.replicate = function (target, opts, done) {
  if (typeof opts === 'function' && !done) {
    done = opts
    opts = {}
  }
  opts = opts || {}
  opts.progressFn = opts.progressFn || noop
  done = done || noop

  // ...
}

OsmSync.prototype.findPeers = function (opts, done) {
  if (typeof opts === 'function' && !done) {
    done = opts
    opts = {}
  }
  opts = opts || {}
  opts.timeout = opts.timeout || 5000
  done = done || noop

  var bonjour = Bonjour()
  var peers = []
  var browser = bonjour.find({ type: 'osm-sync' }, onPeer)
  setTimeout(onDone, opts.timeout)

  function onPeer (info) {
    console.log('Found an osm-sync peer', info)
    peers.push(info)
  }

  function onDone () {
    browser.stop()
    done(null, peers)
  }
}
