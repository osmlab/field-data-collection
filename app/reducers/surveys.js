import types from "../actions";
import OSM from "../config/OSM-2.2.2.json";

const initialState = {
  available: [
    {
      definition: OSM,
      default: true
    }
  ],
  remote: []
};

export default (state = initialState, { id, survey, surveys, type }) => {
  switch (type) {
    case types.CLEAR_LOCAL_SURVEYS:
      return {
        ...state,
        available: initialState.available
      };

    case types.CLEAR_REMOTE_SURVEYS:
      return {
        ...state,
        remote: []
      };

    case types.FETCHING_REMOTE_SURVEY:
      return {
        ...state,
        available: state.available.filter(x => x.id !== id)
      };

    case types.FETCHING_REMOTE_SURVEY_LIST:
      return {
        ...state,
        remote: []
      };

    case types.FETCHING_REMOTE_SURVEY_LIST_FAILED:
      return {
        ...state,
        remote: []
      };

    case types.RECEIVED_REMOTE_SURVEY:
      return {
        ...state,
        available: state.available
          .concat(survey)
          .sort((a, b) =>
            `${a.name} ${a.version}`.localeCompare(`${b.name} ${b.version}`)
          )
      };

    case types.RECEIVED_REMOTE_SURVEY_LIST:
      return {
        ...state,
        remote: surveys
      };

    default:
      return state;
  }
};
