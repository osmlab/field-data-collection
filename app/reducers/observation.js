import types from "../actions";

const initialState = {};

export default (state = initialState, { observation, type }) => {
  switch (type) {
    case types.INITIALIZE_OBSERVATION:
      return observation;

    case types.SET_ACTIVE_OBSERVATION:
      return observation;

    case types.OBSERVATION_SAVED:
      return initialState;

    case types.UPDATE_OBSERVATION:
      const tags = state.tags;
      Object.assign(state, observation);
      Object.assign(state.tags, tags, observation.tags);

      return state;
    default:
      return state;
  }
};
