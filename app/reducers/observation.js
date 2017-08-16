import types from "../actions";

const initialState = {};

export default (state = initialState, { observation, type }) => {
  switch (type) {
    case types.INITIALIZE_OBSERVATION:
      return observation;

    case types.OBSERVATION_SAVED:
      return initialState;

    case types.UPDATE_OBSERVATION:
      return {
        ...state,
        ...observation
      };

    default:
      return state;
  }
};
