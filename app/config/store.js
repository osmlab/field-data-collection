import { applyMiddleware, compose, createStore } from "redux";
import { createLogger } from "redux-logger";
import { persistStore, autoRehydrate } from "redux-persist";
import FilesystemStorage from "redux-persist-filesystem-storage";
import thunk from "redux-thunk";

import reducers from "../reducers";

const middleware = () => {
  return applyMiddleware(
    thunk
    // createLogger({
    //   collapsed: true
    // })
  );
};

const store = compose(autoRehydrate())(createStore)(reducers, middleware());

persistStore(store, {
  storage: FilesystemStorage,
  whitelist: ["surveys", "osm", "coordinator", "user"]
});

export default store;
