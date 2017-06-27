var test = require('tape')
var osmdb = require('osm-p2p-mem')
var osmp2p = require('../app/lib/osm-p2p')

test('create an observation to a placeholder node, and check they are linked', function (t) {
  t.plan(4)

  var osm = osmp2p(osmdb(), osmdb())

  var node = JSON.stringify({
    type: 'node',
    lat: 5,
    lon: -5
  })
  osm.createNode(node, function (err, node) {
    t.error(err)
    var doc = node.value.v
    var nodeId = node.value.k

    var obs = JSON.stringify({
      type: 'observation',
      lat: 6,
      lon: -6
    })
    osm.createObservation(doc.tags['osm-p2p-id'], obs, function (err, obsDoc, linkDoc) {
      t.error(err)
      var obsId = obsDoc.id

      t.equals(linkDoc.obs, obsDoc.id)
      t.equals(linkDoc.link, nodeId)
    })
  })
})

test('create an observation to a real OSM.org node, and check they are linked', function (t) {
  t.end()
})

test('simulate an observation created before & after a placeholder node becomes an OSM.org node, and check they are linked', function (t) {
  t.end()
})
