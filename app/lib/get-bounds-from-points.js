import { envelope, featureCollection, point } from "turf";

export default function setBoundsByPoints(points) {
  const features = featureCollection(
    points.map(item => {
      return point([item.lon, item.lat]);
    })
  );

  return envelope(features);
}
