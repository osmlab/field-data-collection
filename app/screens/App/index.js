import React, { Component } from "react";
import { Platform, UIManager } from "react-native";
import { connect } from "react-redux";
import {
  AndroidBackButton,
  NativeRouter,
  Switch,
  Route
} from "react-router-native";

import {
  dataChanged,
  indexingStarted,
  indexingCompleted,
  osm,
  replicationStarted,
  replicationCompleted
} from "../../actions";

// Observations
import ObservationMap from "../Observation/map";
import Observation from "../Observation/view";
import FieldsetForm from "../Observation/fieldset-form";
import ChoosePoint from "../Observation/choose-point";

// Account
import AccountObservations from "../Account/observations";
import About from "../Account/about";
import AddSurvey from "../Account/add-survey";
import Profile from "../Account/profile";
import Settings from "../Account/settings";
import Surveys from "../Account/surveys";
import Survey from "../Account/survey";

// OSM features
import ViewOsmFeature from "../OsmFeature/view";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export class App extends Component {
  componentDidMount() {
    const {
      dataChanged,
      indexingCompleted,
      indexingStarted,
      replicationCompleted,
      replicationStarted
    } = this.props;

    osm.on("replicating", replicationStarted);
    osm.on("replication-done", replicationCompleted);
    osm.on("indexing", indexingStarted);
    osm.on("indexing-done", indexingCompleted);
    osm.on("change", dataChanged);
  }

  componentWillUnmount() {
    const {
      dataChanged,
      indexingCompleted,
      indexingStarted,
      replicationCompleted,
      replicationStarted
    } = this.props;

    // clear event listeners
    osm.removeListener("replicating", replicationStarted);
    osm.removeListener("replication-done", replicationCompleted);
    osm.removeListener("indexing", indexingStarted);
    osm.removeListener("indexing-done", indexingCompleted);
    osm.removeListener("change", dataChanged);
  }

  render() {
    return (
      <NativeRouter>
        <AndroidBackButton>
          <Switch>
            <Route path="/" exact component={ObservationMap} />

            <Route path="/feature/:id" exact component={ViewOsmFeature} />

            <Route
              path="/observation/choose-point"
              exact
              component={ChoosePoint}
            />

            <Route path="/account/surveys/:surveyId" component={Survey} />

            <Route exact path="/observation" component={Observation} />

            <Route
              exact
              path="/observation/:surveyId/:type"
              component={Observation}
            />

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

export default connect(null, {
  dataChanged,
  indexingCompleted,
  indexingStarted,
  replicationCompleted,
  replicationStarted
})(App);
