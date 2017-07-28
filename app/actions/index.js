import eos from "end-of-stream";
import JSONStream from "JSONStream";
import once from "once";
import RNFetchBlob from "react-native-fetch-blob";
import tar from "tar-stream";
import through2 from "through2";

import osmp2p from "../lib/osm-p2p";
import createOsmp2p from "../lib/create-osm-p2p";
import { findPeers } from "../lib/osm-sync";
import { timeout } from "../lib";
import { selectActiveObservation } from "../selectors";

const Fetch = RNFetchBlob.polyfill.Fetch;
// replace built-in fetch
window.fetch = new Fetch({
  // enable this option so that the response data conversion handled automatically
  auto: true,
  // when receiving response data, the module will match its Content-Type header
  // with strings in this array. If it contains any one of string in this array,
  // the response body will be considered as binary data and the data will be stored
  // in file system instead of in memory.
  // By default, it only store response data to file system when Content-Type
  // contains string `application/octet`.
  binaryContentTypes: ["image/", "video/", "audio/", "application/gzip"]
}).build();

export const osm = osmp2p(createOsmp2p);

const types = {
  CLEAR_LOCAL_SURVEYS: "CLEAR_LOCAL_SURVEYS",
  CLEAR_REMOTE_SURVEYS: "CLEAR_REMOTE_SURVEYS",
  DISCOVERING_PEERS: "DISCOVERING_PEERS",
  DISCOVERING_PEERS_FAILED: "DISCOVERING_PEERS_FAILED",
  FETCHING_REMOTE_SURVEY: "FETCHING_REMOTE_SURVEY",
  FETCHING_REMOTE_SURVEY_FAILED: "FETCHING_REMOTE_SURVEY_FAILED",
  FETCHING_REMOTE_SURVEY_LIST: "FETCHING_REMOTE_SURVEY_LIST",
  FETCHING_REMOTE_SURVEY_LIST_FAILED: "FETCHING_REMOTE_SURVEY_LIST_FAILED",
  INITIALIZE_OBSERVATION: "INITIALIZE_OBSERVATION",
  RECEIVED_REMOTE_SURVEY_LIST: "RECEIVED_REMOTE_SURVEY_LIST",
  RECEIVED_REMOTE_SURVEY: "RECEIVED_REMOTE_SURVEY",
  SAVING_OBSERVATION: "SAVING_OBSERVATION",
  SYNCING_SURVEY_DATA: "SYNCING_SURVEY_DATA",
  SYNCING_SURVEY_DATA_PROGRESS: "SYNCING_SURVEY_DATA_PROGRESS",
  SYNCING_SURVEY_DATA_FAILED: "SYNCING_SURVEY_DATA_FAILED",
  FINISHED_SYNCING_SURVEY_DATA: "FINISHED_SYNCING_SURVEY_DATA",
  SET_AREA_OF_INTEREST: "SET_AREA_OF_INTEREST",
  CLEAR_AREA_OF_INTEREST: "CLEAR_AREA_OF_INTEREST",
  SET_OBSERVATIONS_LAST_SYNCED: "SET_OBSERVATIONS_LAST_SYNCED",
  SET_COORDINATOR_TARGET: "SET_COORDINATOR_TARGET",
  UPDATE_OBSERVATION: "UPDATE_OBSERVATION"
};

// fallback to 10.0.2.2 when connecting to the coordinator (host's localhost from the emulator)
const COORDINATOR_FALLBACK_IP = "10.0.2.2";
const COORDINATOR_FALLBACK_PORT = 3210;

export default types;

const extractSurveyBundle = (id, bundle, _callback) => {
  const survey = {};
  const callback = once(err => {
    return _callback(err, survey);
  });
  const extract = tar.extract();

  eos(extract, callback);

  extract.on("entry", (header, stream, next) => {
    stream.on("end", next);

    if (header.name === "survey.json") {
      stream.pipe(
        JSONStream.parse().on("data", data => {
          survey.icons = data.icons;
          delete data.icons;

          survey.definition = Object.assign(data, { id });
        })
      );
    } else {
      const chunks = [];

      stream
        .pipe(
          through2((chunk, enc, done) => {
            chunks.push(chunk);

            done();
          })
        )
        .on("finish", () => {
          const blob = Buffer.concat(chunks);

          survey[header.name] = blob;
        });
    }
  });

  // NOTE: can't attach multiple handlers to these
  bundle.onData(chunk => extract.write(chunk));
  bundle.onEnd(() => extract.end());

  bundle.open();
};

const checkRemoteOsmMeta = (url, cb) => {
  return fetch(`${url}/osm/meta`)
    .then(rsp => {
      if (rsp.status !== 200) {
        return cb(null, {});
      }

      return rsp.json().then(data => cb(null, data));
    })
    .catch(cb);
};

const checkOsmMeta = (url, getState, cb) => {
  const { osm: { areaOfInterest } } = getState();

  checkRemoteOsmMeta(url, function(err, res) {
    if (err) return cb(err);
    if (!areaOfInterest) return cb(null, true, res);

    if (areaOfInterest.uuid === res.uuid) {
      return cb(null, false);
    }

    return cb(null, true, res);
  });
};

export const syncData = target => (dispatch, getState) => {
  console.log("syncData", target);
  const url = `http://${target.address}:${target.port}`;

  console.log("target url", url);

  checkOsmMeta(url, getState, (err, shouldImportOsm, areaOfInterest) => {
    if (err) return console.warn(err);
    console.log("shouldImportOsm", shouldImportOsm);

    dispatch({
      type: types.SYNCING_SURVEY_DATA
    });

    if (shouldImportOsm) {
      osm.replicate(
        target,
        {
          progressFn
        },
        err => {
          if (err) {
            return dispatch({
              type: types.SYNCING_SURVEY_DATA_FAILED
            });
          }

          console.log("osm.replicate", err);
          dispatch({
            type: types.FINISHED_SYNCING_SURVEY_DATA
          });

          dispatch({
            type: types.SET_AREA_OF_INTEREST,
            areaOfInterest
          });

          dispatch({
            type: types.SET_OBSERVATIONS_LAST_SYNCED,
            observationsLastSynced: Date.now()
          });
        }
      );
    }

    const progressFn = i => {
      console.log("progress", i);
      dispatch({
        type: types.SYNCING_SURVEY_DATA_PROGRESS,
        progress: i,
        id: id
      });
    };
  });
};

const getPeerInfo = (dispatch, callback) => {
  dispatch({
    type: types.DISCOVERING_PEERS
  });

  return findPeers((err, peers) => {
    if (err) {
      return callback(err);
    }

    let targetIP = COORDINATOR_FALLBACK_IP;
    let targetPort = COORDINATOR_FALLBACK_PORT;

    if (peers.length > 0) {
      targetIP = peers[0].address;
      targetPort = peers[0].port;
    }

    dispatch({
      type: types.SET_COORDINATOR_TARGET,
      target: { address: targetIP, port: targetPort }
    });

    return callback(null, targetIP, targetPort);
  });
};

export const clearLocalSurveys = () => (dispatch, getState) =>
  dispatch({
    type: types.CLEAR_LOCAL_SURVEYS
  });

export const clearRemoteSurveys = () => (dispatch, getState) =>
  dispatch({
    type: types.CLEAR_REMOTE_SURVEYS
  });

export const fetchRemoteSurvey = (id, url) => (dispatch, getState) => {
  dispatch({
    id,
    type: types.FETCHING_REMOTE_SURVEY
  });

  return timeout(fetch(`${url}/bundle`), 1000)
    .then(rsp => rsp.rawResp())
    .then(rsp => rsp.readStream())
    .then(
      stream =>
        new Promise((resolve, reject) =>
          extractSurveyBundle(id, stream, (err, survey) => {
            if (err) {
              return reject(new Error(err));
            }

            return resolve(survey);
          })
        )
    )
    .then(survey => {
      dispatch({
        id,
        type: types.RECEIVED_REMOTE_SURVEY,
        survey
      });
    })
    .catch(error =>
      dispatch({
        id,
        type: types.FETCHING_REMOTE_SURVEY_FAILED,
        error
      })
    );
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
          surveys: surveys.map(x => ({
            ...x,
            url: `http://${targetIP}:${targetPort}/surveys/${x.id}`,
            target: {
              address: targetIP,
              port: targetPort
            }
          }))
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

export const initializeObservation = tags => dispatch =>
  dispatch({
    type: types.INITIALIZE_OBSERVATION,
    tags
  });

export const updateObservation = tags => dispatch =>
  dispatch({
    type: types.UPDATE_OBSERVATION,
    tags
  });

export const saveObservation = () => (dispatch, getState) => {
  const { observation } = selectActiveObservation(getState());

  dispatch({
    type: types.SAVING_OBSERVATION,
    observation
  });

  // TODO this is wrong
  // observation currently looks like (still needs a point / associated feature):
  // {
  //   tags: {
  //     highway: "residential",
  //     name: "My Street",
  //     surface: "paved"
  //   }
  // }
  return osm.createObservation(observation, error => {
    if (error) {
      return dispatch({
        type: types.SAVING_OBSERVATION_FAILED,
        error
      });
    }

    return dispatch({
      type: types.OBSERVATION_SAVED
    });
  });
};
