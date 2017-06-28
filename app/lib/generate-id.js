var _counter = 0;

function generatePlaceholderOsmId() {
  return (
    "-" +
    Math.random().toString().substring(2) +
    "-" +
    Date.now() +
    "-" +
    _counter++
  );
}

module.exports = generatePlaceholderOsmId;
