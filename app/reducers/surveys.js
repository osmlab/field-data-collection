import types from "../actions";
import OSM from "../config/OSM-2.2.2.json";

// TODO: include an OSM survey by default
const initialState = {
  fetchingRemoteSurvey: null,
  remoteSurveyFetched: null,
  syncingSurveyData: null,
  surveyDataSynced: null,
  fetchingListFailed: null,
  mdnsConnectionFailed: null,
  manualConnectionFailed: null,
  available: [],
  active: [],
  remote: []
};

export default (
  state = initialState,
  { id, survey, surveys, type, failedConnectionType }
) => {
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
        fetchingRemoteSurvey: true,
        remoteSurveyFetched: false,
        available: state.available.filter(
          ({ definition }) => definition.id !== id
        )
      };

    case types.FETCHING_REMOTE_SURVEY_LIST:
      return {
        ...state,
        remote: []
      };

    case types.FETCHING_REMOTE_SURVEY_LIST_FAILED:
      return {
        ...state,
        remote: [],
        fetchingListFailed: true,
        mdnsConnectionFailed: failedConnectionType === "mdns",
        manualConnectionFailed: failedConnectionType === "manual"
      };

    case types.RECEIVED_REMOTE_SURVEY:
      return {
        ...state,
        fetchingRemoteSurvey: false,
        remoteSurveyFetched: true,
        available: state.available
          .concat(survey)
          .sort((a, b) =>
            `${a.name} ${a.version}`.localeCompare(`${b.name} ${b.version}`)
          )
      };

    case types.RECEIVED_REMOTE_SURVEY_LIST:
      return {
        ...state,
        remote: surveys,
        fetchingListFailed: null,
        mdnsConnectionFailed: null,
        manualConnectionFailed: null
      };

    case types.SYNCING_SURVEY_DATA:
      return {
        ...state,
        syncingSurveyData: true,
        surveyDataSynced: false
      };

    case types.FINISHED_SYNCING_SURVEY_DATA:
      return {
        ...state,
        syncingSurveyData: false,
        surveyDataSynced: true
      };

    case types.DELETE_LOCAL_SURVEY:
      return {
        ...state,
        available: state.available.filter(s => s.definition.id !== id)
      };

    /**
       * state.active is a list of survey ids
       * that the user has toggled on in Account/Surveys
       * 
       */
    case types.TOGGLE_SURVEY_ACTIVITY:
      // Check if state.active contains the survey
      let isActive = !!state.active.find(v => v === id);
      if (isActive) {
        return {
          ...state,
          active: state.active.filter(v => v !== id)
        };
      } else {
        return {
          ...state,
          active: [...state.active, id]
        };
      }

    default:
      return state;
  }
};
