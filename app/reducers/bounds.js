import types from "../actions";

const initialState = {
  selected: null,
  visible: null
};

export default (state = initialState, { bounds, type }) => {
  switch (type) {
    case types.BBOX_CLEARED:
      return {
        ...state,
        selected: null
      };

    case types.BBOX_SELECTED:
      return {
        ...state,
        selected: bounds
      };

    case types.VISIBLE_BOUNDS_UPDATED:
      return {
        ...state,
        visible: bounds
      };

    default:
      return state;
  }
};
