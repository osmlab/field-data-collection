import "./lib/global";

import React, { Component } from "react";
import { Provider } from "react-redux";

import store from "./config/store";
import App from "./screens/App";

// temporary, for testing websockets:
import AddSurveyScreen from "./screens/Account/add-survey";

class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <AddSurveyScreen />
      </Provider>
    );
  }
}

export default Root;
