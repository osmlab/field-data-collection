import types from "../actions";

const initialState = {
  message: null,
  error: null
};

export default (state = initialState, { error, type }) => {
  switch (type) {
    // TODO types can be mapped to messages with a lookup table
    case types.DISCOVERING_PEERS:
      return {
        ...state,
        error,
        message: "Discovering peers..."
      };

    case types.DISCOVERING_PEERS_FAILED:
      return {
        ...state,
        error,
        message: "Discovering peers failed."
      };

    case types.FETCHING_REMOTE_SURVEY:
      return {
        ...state,
        error,
        message: "Fetching remote survey..."
      };

    case types.FETCHING_REMOTE_SURVEY_LIST:
      return {
        ...state,
        error,
        message: "Fetching remote survey list..."
      };

    case types.FETCHING_REMOTE_SURVEY_FAILED:
      return {
        ...state,
        error,
        message: "Fetching remote survey failed."
      };

    case types.FETCHING_REMOTE_SURVEY_LIST_FAILED:
      return {
        ...state,
        error,
        message: "Fetching remote survey list failed."
      };

    case types.RECEIVED_REMOTE_SURVEY:
    case types.RECEIVED_REMOTE_SURVEY_LIST:
      return {
        ...state,
        error, // will reset error
        message: null
      };

    case types.SYNCING_SURVEY_DATA:
      return {
        ...state,
        error,
        message: "Syncing survey data..."
      };

    case types.SYNCING_SURVEY_DATA_FAILED:
      return {
        ...state,
        error,
        message: "Syncing survey data failed."
      };

    case types.FINISHED_SYNCING_SURVEY_DATA:
      return {
        ...state,
        error,
        message: "Survey data sync complete."
      };

    default:
      return state;
  }
};
