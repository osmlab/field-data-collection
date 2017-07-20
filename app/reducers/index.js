import { combineReducers } from "redux";

import status from "./status";
import surveys from "./surveys";
import osm from "./osm";
import coordinator from "./coordinator";

export default combineReducers({
  status,
  surveys,
  osm,
  coordinator
});
