import types from "../actions";

const initialState = {
  list: []
};

export default (state = initialState, { type, list }) => {
  switch (type) {
    case types.SET_OBSERVATION_LIST:
      return {
        ...state,
        list: list
      };

    case types.CLEAR_OBSERVATION_LIST:
      return {
        ...state,
        list: []
      };

    default:
      return state;
  }
};
