import { combineReducers } from "redux";

import bounds from "./bounds";
import features from "./features";
import observation from "./observation";
import observations from "./observations";
import status from "./status";
import surveys from "./surveys";
import osm from "./osm";
import coordinator from "./coordinator";
import user from "./user";

export default combineReducers({
  bounds,
  features,
  // the active observation being collected
  observation,
  observations,
  status,
  surveys,
  osm,
  coordinator,
  user
});
