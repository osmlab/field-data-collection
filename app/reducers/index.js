import { combineReducers } from "redux";

import { reducer as app } from "../screens/App/navigator";

import { reducer as createObservation } from "../screens/CreateObservation/navigator";

import status from "./status";
import surveys from "./surveys";

export default combineReducers({
  app,
  createObservation,
  status,
  surveys
});
