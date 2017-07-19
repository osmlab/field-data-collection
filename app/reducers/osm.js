import types from "../actions";

const initialState = {
  areaOfInterest: null
};

export default (state = initialState, { areaOfInterest, type }) => {
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

    default:
      return state;
  }
};
