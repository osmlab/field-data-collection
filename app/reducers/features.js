import types from "../actions";

const initialState = {
  activeTileQueries: [],
  features: {},
  selectedFeatures: [],
  loading: false
};

export default (
  state = initialState,
  { bounds, features, results, tile, type }
) => {
  switch (type) {
    case types.BBOX_CLEARED:
      return {
        ...state,
        selectedBounds: null,
        selectedFeatures: []
      };

    // TODO this is a component state thing, not a Redux thing (though it is convenient to know what's selected)
    case types.BBOX_SELECTED:
      return {
        ...state,
        selectedBounds: bounds,
        selectedFeatures: results
      };

    case types.VISIBLE_BOUNDS_UPDATED:
      return {
        ...state,
        visibleBounds: bounds
      };

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
        loading: false
      };

    case types.QUERYING_TILE:
      return {
        ...state,
        activeTileQueries: state.activeTileQueries.includes(tile.join("/"))
          ? state.activeTileQueries
          : state.activeTileQueries.concat(tile.join("/"))
      };

    case types.TILE_QUERY_FAILED:
      return {
        ...state,
        activeTileQueries: state.activeTileQueries.splice(
          state.activeTileQueries.indexOf(tile.join("/")),
          1
        )
      };

    case types.TILE_QUERIED:
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
