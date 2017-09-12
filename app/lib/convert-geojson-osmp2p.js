module.exports = {
  toOSM: toOSM,
  toGeoJSON: toGeoJSON
};

function toOSM(feature, type) {
  var observation = {
    id: feature.id,
    tags: feature.properties,
    timestamp: feature.timestamp || new Date().toISOString()
  };

  if (feature.type === "Point") {
    observation.type = "node";
    observation.lon = feature.geometry.coordinates[0];
    observation.lat = feature.geometry.coordinates[1];
  }

  if (type) {
    observation.type = type;
  }

  return observation;
}

function toGeoJSON(observation, id) {
  var feature = {
    id: id,
    type: "Feature",
    geometry: null,
    properties: observation.tags
  };

  if (observation.lon && observation.lat) {
    feature.geometry = {
      type: "Point",
      coordinates: [observation.lon, observation.lat]
    };
  }

  return feature;
}
