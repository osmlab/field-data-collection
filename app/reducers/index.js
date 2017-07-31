import { combineReducers } from "redux";

import observation from "./observation";
import observations from "./observations";
import status from "./status";
import surveys from "./surveys";
import osm from "./osm";
import coordinator from "./coordinator";

export default combineReducers({
  // the active observation being collected
  observation,
  observations,
  status,
  surveys,
  osm,
  coordinator
});
