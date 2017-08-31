import types from "../actions";

const initialState = {
  activeTileQueries: [],
  features: {},
  selected: [],
  loading: false
};

export default (state = initialState, { bounds, features, tile, type }) => {
  switch (type) {
    case types.BBOX_CLEARED:
      return {
        ...state,
        selectedBounds: null,
        selected: []
      };

    // TODO this is a component state thing, not a Redux thing (though it is convenient to know what's selected)
    case types.BBOX_SELECTED:
      return {
        ...state,
        // TODO belongs elsewhere (shared with observations)
        selectedBounds: bounds,
        selected: features
      };

    case types.VISIBLE_BOUNDS_UPDATED:
      return {
        ...state,
        // TODO belongs elsewhere (shared with observations)
        visibleBounds: bounds
      };

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
      return {
        ...state,
        activeTileQueries: state.activeTileQueries.splice(
          state.activeTileQueries.indexOf(tile.join("/")),
          1
        )
      };

    case types.TILE_QUERIED_FOR_FEATURES:
      console.log("tile queried:", tile);
      return {
        ...state,
        activeTileQueries: state.activeTileQueries.splice(
          state.activeTileQueries.indexOf(tile.join("/")),
          1
        ),
        features: {
          ...state.features,
          [tile.join("/")]: features
        }
      };

    default:
      return state;
  }
};
