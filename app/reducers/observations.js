import types from "../actions";

const initialState = {
  list: []
};

export default (state = initialState, { type, list }) => {
  switch (type) {
    case types.SET_OBSERVATIONS:
      return {
        ...state,
        list: list
      };

    case types.CLEAR_OBSERVATIONS:
      return initialState;

    default:
      return state;
  }
};
