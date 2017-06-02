import { combineReducers } from "redux";

import { reducer as account } from "../screens/Account/navigator";
import { reducer as app } from "../screens/App/navigator";
import {
  reducer as createObservation
} from "../screens/CreateObservation/navigator";
import { reducer as observations } from "../screens/Observations/navigator";

export default combineReducers({
  account,
  app,
  createObservation,
  observations
});
