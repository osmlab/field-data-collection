const randomBytes = require('randombytes')
const convert = require('base-convertor')

function generatePlaceholderOsmId () {
  return '-' + hex2dec(randomBytes(8).toString('hex'))
}

function hex2dec (hex) {
  return convert(hex.toUpperCase(), '0123456789ABCDEF', '0123456789')
}

module.exports = generatePlaceholderOsmId
