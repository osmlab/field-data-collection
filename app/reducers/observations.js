import types from "../actions";

const initialState = {
  activeTileQueries: [],
  observations: {}
};

export default (state = initialState, { bounds, observations, tile, type }) => {
  let idx;

  switch (type) {
    case types.OSM_DATA_CHANGED:
    case types.OBSERVATION_SAVED:
      return {
        ...state,
        observations: {}
      };

    case types.QUERYING_TILE_FOR_OBSERVATIONS:
      return {
        ...state,
        activeTileQueries: state.activeTileQueries.includes(tile.join("/"))
          ? state.activeTileQueries
          : state.activeTileQueries.concat(tile.join("/"))
      };

    case types.OBSERVATION_TILE_QUERY_FAILED:
      idx = state.activeTileQueries.indexOf(tile.join("/"));

      return {
        ...state,
        activeTileQueries: [
          ...state.activeTileQueries.slice(0, idx),
          ...state.activeTileQueries.slice(idx + 1)
        ]
      };

    case types.TILE_QUERIED_FOR_OBSERVATIONS:
      console.log("observation tile queried:", tile);
      idx = state.activeTileQueries.indexOf(tile.join("/"));

      return {
        ...state,
        activeTileQueries: [
          ...state.activeTileQueries.slice(0, idx),
          ...state.activeTileQueries.slice(idx + 1)
        ],
        observations: {
          ...state.observations,
          [tile.join("/")]: observations
        }
      };

    default:
      return state;
  }
};
