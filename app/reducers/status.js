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
  [types.SYNCING_SURVEY_DATA]: "Importing survey data...",
  [types.SYNCING_SURVEY_DATA_FAILED]: "Importing survey data failed.",
  [types.FINISHED_SYNCING_SURVEY_DATA]: "Survey import complete",
  [types.SAVING_OBSERVATION]: "Saving observation...",
  [types.SAVING_OBSERVATION_FAILED]: "Saving observation failed.",
  [types.REPLICATION_STARTED]: "Replicating OSM data...",
  [types.REPLICATION_COMPLETED]: "OSM replication completed.",
  [types.INDEXING_STARTED]: "Indexing OSM data...",
  [types.INDEXING_COMPLETED]: "OSM indexing completed.",
  [types.SAVING_PROFILE_COMPLETED]: "Profile saved!",
  [types.OBSERVATION_SAVED]: "Observation saved!"
};

export default (state = initialState, { error, type, message }) => {
  if (MESSAGES[type]) {
    return {
      ...state,
      error,
      message: MESSAGES[type]
    };
  } else if (type === types.NOTIFY_ACTIVE_SURVEYS) {
    return {
      ...state,
      message: message
    };
  } else if (type === types.CLEAR_STATUS) {
    return initialState;
  }

  return state;
};
