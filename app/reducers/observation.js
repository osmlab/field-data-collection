import types from "../actions";

const initialState = {
  tags: {}
};

export default (state = initialState, { tags, type }) => {
  switch (type) {
    case types.INITIALIZE_OBSERVATION:
      return {
        tags
      };

    case types.OBSERVATION_SAVED:
      return initialState;

    case types.UPDATE_OBSERVATION:
      return {
        ...state,
        tags: {
          ...state.tags,
          ...tags
        }
      };

    default:
      return state;
  }
};
