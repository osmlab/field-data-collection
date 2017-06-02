import { AsyncStorage } from "react-native";
import { applyMiddleware, compose, createStore } from "redux";
import { createLogger } from "redux-logger";
import { persistStore, autoRehydrate } from "redux-persist";

import reducers from "../reducers";

const middleware = () => {
  return applyMiddleware(createLogger());
};

const store = compose(autoRehydrate())(createStore)(reducers, middleware());

persistStore(store, {
  storage: AsyncStorage
});

export default store;
