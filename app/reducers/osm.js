import types from "../actions";

const initialState = {
  areaOfInterest: null,
  selectedFeatures: null,
  loading: false
};

export default (
  state = initialState,
  { areaOfInterest, bounds, syncDate, list, results, type }
) => {
  switch (type) {
    case types.SET_AREA_OF_INTEREST:
      return {
        ...state,
        areaOfInterest
      };

    case types.CLEAR_AREA_OF_INTEREST:
      return {
        ...state,
        areaOfInterest: null
      };

    // TODO these should not be persistent (so they belong elsewhere in the Redux tree)

    case types.BBOX_CLEARED:
      return {
        ...state,
        selectedBounds: null,
        selectedFeatures: []
      };

    // TODO this is a component state thing, not a Redux thing (though it is convenient to know what's selected)
    case types.BBOX_SELECTED:
      console.log("bbox selected:", bounds);
      console.log("selected features:", results);
      return {
        ...state,
        selectedBounds: bounds,
        selectedFeatures: results
      };

    case types.VISIBLE_BOUNDS_UPDATED:
      console.log("Visible bounds updated:", bounds);
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
        loading: false
      };

    default:
      return state;
  }
};
