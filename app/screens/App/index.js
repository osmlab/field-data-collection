import React, { Component } from "react";
import { Platform, UIManager } from "react-native";
import {
  AndroidBackButton,
  NativeRouter,
  Switch,
  Route
} from "react-router-native";

// Observations
import ObservationMap from "../Observation/map.js";
import Observation from "../Observation/view";
import FieldsetForm from "../Observation/fieldset-form";
import Categories from "../Observation/categories";
import ChoosePoint from "../Observation/choose-point";

// Account
import AccountObservations from "../Account/observations";
import About from "../Account/about";
import AddSurvey from "../Account/add-survey";
import Profile from "../Account/profile";
import Settings from "../Account/settings";
import Surveys from "../Account/surveys";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default class App extends Component {
  render() {
    return (
      <NativeRouter>
        <AndroidBackButton>
          <Switch>
            <Route path="/" exact component={ObservationMap} />

            <Route
              path="/observation/choose-point"
              exact
              component={ChoosePoint}
            />

            <Route
              exact
              path="/observation/categories"
              component={Categories}
            />

            <Route
              exact
              path="/observation/:surveyId/:type"
              component={Observation}
            />

            <Route path="/observation/details" component={Observation} />

            <Route
              path="/observation/:surveyId/:type/fields"
              component={FieldsetForm}
            />

            <Route
              path="/account/observations"
              component={AccountObservations}
            />

            <Route path="/account/about" component={About} />
            <Route path="/account/add-survey" component={AddSurvey} />
            <Route path="/account/profile" component={Profile} />
            <Route path="/account/settings" component={Settings} />
            <Route path="/account/surveys" component={Surveys} />
          </Switch>
        </AndroidBackButton>
      </NativeRouter>
    );
  }
}
