import types from "../actions";

const initialState = {
  activeTileQueries: [],
  observations: {},
  selected: []
};

export default (state = initialState, { bounds, observations, tile, type }) => {
  switch (type) {
    case types.BBOX_CLEARED:
      return {
        ...state,
        selected: []
      };

    // TODO this is a component state thing, not a Redux thing (though it is convenient to know what's selected)
    case types.BBOX_SELECTED:
      return {
        ...state,
        selected: observations
      };

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
      return {
        ...state,
        activeTileQueries: state.activeTileQueries.splice(
          state.activeTileQueries.indexOf(tile.join("/")),
          1
        )
      };

    case types.TILE_QUERIED_FOR_OBSERVATIONS:
      console.log("tile queried:", tile);
      return {
        ...state,
        activeTileQueries: state.activeTileQueries.splice(
          state.activeTileQueries.indexOf(tile.join("/")),
          1
        ),
        observations: {
          ...state.observations,
          [tile.join("/")]: observations
        }
      };

    default:
      return state;
  }
};
