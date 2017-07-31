import types from "../actions";

const initialState = {
  areaOfInterest: null,
  featureList: []
};

export default (
  state = initialState,
  { areaOfInterest, syncDate, list, type }
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

    case types.SET_OSM_FEATURE_LIST:
      return {
        ...state,
        featureList: list
      };

    case types.SET_OSM_FEATURE_LIST:
      return {
        ...state,
        featureList: []
      };

    default:
      return state;
  }
};
