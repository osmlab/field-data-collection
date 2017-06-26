import types from "../actions";

const initialState = {
  message: "",
  error: null
};

export default (state = initialState, { error, type }) => {
  switch (type) {
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

    default:
      return state;
  }
};
