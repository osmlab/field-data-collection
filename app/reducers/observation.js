import types from "../actions";

const initialState = {
  nodeId: null,
  observation: null
};

export default (state = initialState, { nodeId, observation, type }) => {
  switch (type) {
    case types.INITIALIZE_OBSERVATION:
      return {
        nodeId,
        observation
      };

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
