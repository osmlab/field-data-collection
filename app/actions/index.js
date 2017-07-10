import dataUriToBuffer from "data-uri-to-buffer";
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

const obsdb = createOsmp2p("obs");
const osmdb = createOsmp2p("osm");
const osm = osmp2p(obsdb, osmdb);

const types = {
  CLEAR_LOCAL_SURVEYS: "CLEAR_LOCAL_SURVEYS",
  CLEAR_REMOTE_SURVEYS: "CLEAR_REMOTE_SURVEYS",
  DISCOVERING_PEERS: "DISCOVERING_PEERS",
  DISCOVERING_PEERS_FAILED: "DISCOVERING_PEERS_FAILED",
  FETCHING_REMOTE_SURVEY: "FETCHING_REMOTE_SURVEY",
  FETCHING_REMOTE_SURVEY_FAILED: "FETCHING_REMOTE_SURVEY_FAILED",
  FETCHING_REMOTE_SURVEY_LIST: "FETCHING_REMOTE_SURVEY_LIST",
  FETCHING_REMOTE_SURVEY_LIST_FAILED: "FETCHING_REMOTE_SURVEY_LIST_FAILED",
  RECEIVED_REMOTE_SURVEY_LIST: "RECEIVED_REMOTE_SURVEY_LIST",
  RECEIVED_REMOTE_SURVEY: "RECEIVED_REMOTE_SURVEY",
  SYNCING_SURVEY_DATA: "SYNCING_SURVEY_DATA",
  SYNCING_SURVEY_DATA_PROGRESS: "SYNCING_SURVEY_DATA_PROGRESS",
  SYNCING_SURVEY_DATA_FAILED: "SYNCING_SURVEY_DATA_FAILED",
  FINISHED_SYNCING_SURVEY_DATA: "FINISHED_SYNCING_SURVEY_DATA",
  SET_AREA_OF_INTEREST: "SET_AREA_OF_INTEREST"
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
          survey.icons = survey.icons || {};

          data.icons.forEach(
            ({ icon, src }) => (survey.icons[icon] = dataUriToBuffer(src))
          );

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
    .then(res => {
      res.json().then(data => cb(null, data));
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

export const syncSurveyData = survey => (dispatch, getState) => {
  const { id, target } = survey;
  const url = `http://${target.address}:${target.port}`;

  checkOsmMeta(url, getState, (err, shouldSync, areaOfInterest) => {
    if (err) return console.warn(err);
    if (!shouldSync) {
      return dispatch({
        type: types.FINISHED_SYNCING_SURVEY_DATA,
        id
      });
    }

    dispatch({
      type: types.SYNCING_SURVEY_DATA,
      id: id
    });

    const progressFn = i => {
      dispatch({
        type: types.SYNCING_SURVEY_DATA_PROGRESS,
        progress: i,
        id: id
      });
    };

    osm.replicate(target, { progressFn }, err => {
      if (err) {
        return dispatch({
          type: types.SYNCING_SURVEY_DATA_FAILED,
          id
        });
      }

      dispatch({
        type: types.FINISHED_SYNCING_SURVEY_DATA,
        id
      });

      dispatch({
        type: types.SET_AREA_OF_INTEREST,
        areaOfInterest
      });
    });
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
      ({ targetIP, targetPort } = peers[0]);
    }

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
