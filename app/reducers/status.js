import types from "../actions";

const initialState = {
  message: null,
  error: null
};

const MESSAGES = {
  [types.DISCOVERING_PEERS]: "Discovering peers...",
  [types.DISCOVERING_PEERS_FAILED]: "Discovering peers failed.",
  [types.FETCHING_REMOTE_SURVEY]: "Fetching remote survey...",
  [types.FETCHING_REMOTE_SURVEY_LIST]: "Fetching remote survey list...",
  [types.FETCHING_REMOTE_SURVEY_FAILED]: "Fetching remote survey failed.",
  [types.FETCHING_REMOTE_SURVEY_LIST_FAILED]:
    "Fetching remote survey list failed.",
  [types.SYNCING_SURVEY_DATA]: "Syncing survey data...",
  [types.SYNCING_SURVEY_DATA_FAILED]: "Syncing survey data failed.",
  [types.FINISHED_SYNCING_SURVEY_DATA]: "Survey data sync complete"
};

export default (state = initialState, { error, type }) => {
  if (MESSAGES[type]) {
    return {
      ...state,
      error,
      message: MESSAGES[type]
    };
  }

  return state;
};
