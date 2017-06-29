import dataUriToBuffer from "data-uri-to-buffer";
import eos from "end-of-stream";
import JSONStream from "JSONStream";
import once from "once";
import tar from "tar-stream";
import through2 from "through2";

import { findPeers } from "../lib/osm-sync";
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

  extract.end(bundle);
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
    .then(rsp => rsp.blob())
    .then(
      blob =>
        new Promise((resolve, reject) => {
          var reader = new FileReader();

          reader.addEventListener("loadend", () =>
            resolve(new Buffer(reader.result))
          );
          reader.addEventListener("error", err => reject(err));

          reader.readAsArrayBuffer(blob);
        })
    )
    .then(
      bundle =>
        new Promise((resolve, reject) =>
          extractSurveyBundle(id, bundle, (err, surveys) => {
            if (err) {
              return reject(new Error(err));
            }

            return resolve(surveys);
          })
        )
    )
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
            url: `http://${targetIP}:${targetPort}/surveys/${x.id}`
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
