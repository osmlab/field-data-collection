var Bonjour = require('bonjour')
var websocket = require('websocket-stream')
var eos = require('end-of-stream')

module.exports = OsmSync

function noop () {}

function OsmSync (observationDb, osmOrgDb) {
  if (!(this instanceof OsmSync)) return new OsmSync(observationDb, cacheDb)

  this.observationDb = observationDb
  this.osmOrgDb = osmOrgDb
}

OsmSync.prototype.replicate = function (target, opts, done) {
  if (typeof opts === 'function' && !done) {
    done = opts
    opts = {}
  }
  opts = opts || {}
  opts.progressFn = opts.progressFn || noop
  done = done || noop

  var finished = 0
  replicateObservationDb(target, onFinish)
  replicateOsmOrg(target, onFinish)

  opts.progressFn(0)

  function onFinish (err) {
    console.log('finished replicating', finished)
    if (err) { finished--; return done(err) }
    if (++finished === 2) done()
    opts.progressFn(finished / 2)
  }
}

function replicateObservationDb (target, done) {
  var socket = websocket('ws://' + target.address + ':' + target.port + '/replicate/observations')
  var rs = this.observationDb.createReplicationStream()
  replicate(socket, rs, done)
}

function replicateOsmOrg (target, done) {
  var socket = websocket('ws://' + target.address + ':' + target.port + '/replicate/osm')
  var rs = this.osmOrgDb.createReplicationStream()
  replicate(socket, rs, done)
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

function replicate (a, b, done) {
  eos(stream, done)
  eos(socket, done)

  var pending = 2
  function done (err) {
    if (err) { pending++; return done(err) }
    if (--pending === 0) done()
  }
}
