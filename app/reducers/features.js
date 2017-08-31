import types from "../actions";

const initialState = {
  activeTileQueries: [],
  features: {},
  loading: false
};

export default (state = initialState, { bounds, features, tile, type }) => {
  let idx;

  switch (type) {
    // TODO belongs elsewhere (shared with observations)
    case types.REPLICATION_STARTED:
    case types.REPLICATION_COMPLETED:
    case types.INDEXING_STARTED:
    case types.INDEXING_COMPLETED:
      return {
        ...state,
        loading: true
      };

    case types.OSM_DATA_CHANGED:
      return {
        ...state,
        features: {},
        // TODO belongs elsewhere
        loading: false
      };

    case types.QUERYING_TILE_FOR_FEATURES:
      return {
        ...state,
        activeTileQueries: state.activeTileQueries.includes(tile.join("/"))
          ? state.activeTileQueries
          : state.activeTileQueries.concat(tile.join("/"))
      };

    case types.FEATURE_TILE_QUERY_FAILED:
      idx = state.activeTileQueries.indexOf(tile.join("/"));

      return {
        ...state,
        activeTileQueries: [
          ...state.activeTileQueries.slice(0, idx),
          ...state.activeTileQueries.slice(idx + 1)
        ]
      };

    case types.TILE_QUERIED_FOR_FEATURES:
      console.log("feature tile queried:", tile);
      idx = state.activeTileQueries.indexOf(tile.join("/"));

      return {
        ...state,
        activeTileQueries: [
          ...state.activeTileQueries.slice(0, idx),
          ...state.activeTileQueries.slice(idx + 1)
        ],
        features: {
          ...state.features,
          [tile.join("/")]: features
        }
      };

    default:
      return state;
  }
};
