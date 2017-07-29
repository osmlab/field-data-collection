import types from "../actions";

const initialState = {
  coordinatorTarget: null,
  observationsLastSynced: null
};

export default (
  state = initialState,
  { target, observationsLastSynced, type }
) => {
  if (type === types.SET_COORDINATOR_TARGET) console.log(type, target);

  switch (type) {
    case types.SET_OBSERVATIONS_LAST_SYNCED:
      return {
        ...state,
        observationsLastSynced
      };

    case types.SET_COORDINATOR_TARGET:
      return {
        ...state,
        coordinatorTarget: target
      };

    default:
      return state;
  }
};
