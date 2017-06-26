import OSMSync from "../lib/osm-sync";
import { timeout } from "../lib";

const types = {
  CLEAR_REMOTE_SURVEYS: "CLEAR_REMOTE_SURVEYS",
  DISCOVERING_PEERS: "DISCOVERING_PEERS",
  DISCOVERING_PEERS_FAILED: "DISCOVERING_PEERS_FAILED",
  FETCHING_REMOTE_SURVEY: "FETCHING_REMOTE_SURVEY",
  FETCHING_REMOTE_SURVEY_FAILED: "FETCHING_REMOTE_SURVEY_FAILED",
  FETCHING_REMOTE_SURVEY_LIST: "FETCHING_REMOTE_SURVEY_LIST",
  FETCHING_REMOTE_SURVEY_LIST_FAILED: "FETCHING_REMOTE_SURVEY_LIST_FAILED",
  RECEIVED_REMOTE_SURVEY_LIST: "RECEIVED_REMOTE_SURVEY_LIST",
  RECEIVED_REMOTE_SURVEY: "RECEIVED_REMOTE_SURVEY"
};

// fallback to 10.0.2.2 when connecting to the coordinator (host's localhost from the emulator)
const COORDINATOR_FALLBACK_IP = "10.0.2.2";
const COORDINATOR_FALLBACK_PORT = 3210;

export default types;

const getPeerInfo = (dispatch, callback) => {
  dispatch({
    type: types.DISCOVERING_PEERS
  });

  return new OSMSync().findPeers((err, peers) => {
    if (err) {
      return callback(err);
    }

    let targetIP = COORDINATOR_FALLBACK_IP;
    let targetPort = COORDINATOR_FALLBACK_PORT;

    if (peers.length > 0) {
      ({ targetIP, targetPort } = peers[0]);
    }

    return callback(null, targetIP, targetPort);
  });
};

export const clearRemoteSurveys = () => (dispatch, getState) =>
  dispatch({
    type: types.CLEAR_REMOTE_SURVEYS
  });

export const fetchRemoteSurvey = id => (dispatch, getState) => {
  return getPeerInfo(dispatch, (err, targetIP, targetPort) => {
    if (err) {
      console.warn(err);
      return dispatch({
        type: types.DISCOVERING_PEERS_FAILED,
        error: err
      });
    }

    dispatch({
      id,
      type: types.FETCHING_REMOTE_SURVEY
    });

    return timeout(
      fetch(`http://${targetIP}:${targetPort}/surveys/${id}`),
      1000
    )
      .then(rsp => rsp.json())
      .then(survey =>
        dispatch({
          id,
          type: types.RECEIVED_REMOTE_SURVEY,
          survey
        })
      )
      .catch(error =>
        dispatch({
          id,
          type: types.FETCHING_REMOTE_SURVEY_FAILED,
          error
        })
      );
  });
};

export const listRemoteSurveys = () => (dispatch, getState) => {
  return getPeerInfo(dispatch, (err, targetIP, targetPort) => {
    if (err) {
      console.warn(err);
      return dispatch({
        type: types.DISCOVERING_PEERS_FAILED,
        error: err
      });
    }

    dispatch({
      type: types.FETCHING_REMOTE_SURVEY_LIST
    });

    return timeout(fetch(`http://${targetIP}:${targetPort}/surveys/list`), 1000)
      .then(rsp => rsp.json())
      .then(surveys =>
        dispatch({
          type: types.RECEIVED_REMOTE_SURVEY_LIST,
          surveys
        })
      )
      .catch(error =>
        dispatch({
          type: types.FETCHING_REMOTE_SURVEY_LIST_FAILED,
          error
        })
      );
  });
};
