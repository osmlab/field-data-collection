import { combineReducers } from "redux";

import { reducer as app } from "../screens/App/navigator";

import status from "./status";
import surveys from "./surveys";
import osm from "./osm";

export default combineReducers({
  app,
  status,
  surveys,
  osm
});
