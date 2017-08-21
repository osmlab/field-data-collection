import { center, featureCollection, point } from "turf";

export default function setBoundsByPoints(points) {
  const features = featureCollection(
    points.map(item => {
      return point([item.lon, item.lat]);
    })
  );

  var feature = center(features);

  return {
    longitude: feature.geometry.coordinates[0],
    latitude: feature.geometry.coordinates[1]
  };
}
