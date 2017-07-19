import { combineReducers } from "redux";

import status from "./status";
import surveys from "./surveys";
import osm from "./osm";

export default combineReducers({
  status,
  surveys,
  osm
});
