import { pointToTile } from "@mapbox/tilebelt";

const wait = timeout => new Promise(resolve => setTimeout(resolve, timeout));

export const timeout = (p, timeout = 30e3) =>
  Promise.race([
    p,
    wait(timeout).then(() => {
      throw new Error(`Timed out after ${timeout} ms`);
    })
  ]);

export const tilesForBounds = bounds => {
  if (bounds == null) {
    return [];
  }

  // TODO configure this somewhere
  const zoom = 16;

  const sw = pointToTile(...bounds.slice(0, 2), zoom);
  const ne = pointToTile(...bounds.slice(2, 4), zoom);

  const tiles = [];

  for (let x = sw[0]; x <= ne[0]; x++) {
    for (let y = ne[1]; y <= sw[1]; y++) {
      tiles.push([x, y, zoom]);
    }
  }

  return tiles;
};
