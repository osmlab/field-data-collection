import types from "../actions";

const initialState = {
  active: null
};

export default (state = initialState, { observation, type }) => {
  switch (type) {
    case types.INITIALIZE_OBSERVATION:
      return {
        ...state,
        active: observation
      };

    case types.SET_ACTIVE_OBSERVATION:
      return {
        ...state,
        active: observation
      };

    case types.OBSERVATION_SAVED:
      return {
        ...state,
        active: observation
      };

    case types.UPDATE_OBSERVATION:
      return {
        ...state,
        active: {
          ...state.active,
          ...observation,
          tags: {
            ...state.active.tags,
            ...observation.tags
          }
        }
      };

    default:
      return state;
  }
};
