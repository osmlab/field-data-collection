import { applyMiddleware, combineReducers, createStore } from "redux";
import { createLogger } from "redux-logger";

import { reducer as account } from "../screens/Account/navigator";
import { reducer as app } from "../screens/App/navigator";
import {
  reducer as createObservation
} from "../screens/CreateObservation/navigator";
import { reducer as observations } from "../screens/Observations/navigator";

const middleware = () => {
  return applyMiddleware(createLogger());
};

export default createStore(
  combineReducers({
    account,
    app,
    createObservation,
    observations
  }),
  middleware()
);
