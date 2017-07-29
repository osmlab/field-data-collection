import { combineReducers } from "redux";

import observation from "./observation";
import osm from "./osm";
import status from "./status";
import surveys from "./surveys";

export default combineReducers({
  // the active observation being collected
  observation,
  osm,
  status,
  // survey definitions
  surveys
});
