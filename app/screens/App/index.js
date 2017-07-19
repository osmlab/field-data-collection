import React, { Component } from "react";
import { View, Animated, Platform, UIManager } from "react-native";
import { NativeRouter, Switch, Route, Link } from "react-router-native";
import { connect } from "react-redux";

import { Text } from "../../components";

// Observations
import ObservationMap from "../Observations/map.js";
import ObservationList from "../Observations/list.js";
import AddObservation from "../Observations/create";
import FieldsetForm from "../Observations/fieldset-form";
import Categories from "../Observations/categories";
import Location from "../Observations/location";

// Account
import MyObservations from "../Account/observations";
import About from "../Account/about";
import AddSurvey from "../Account/add-survey";
import Profile from "../Account/profile";
import Settings from "../Account/settings";
import Surveys from "../Account/surveys";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

class App extends Component {
  render() {
    return (
      <NativeRouter>
        <Switch>
          <Route path="/" exact component={ObservationMap} />
          <Route path="/list" component={ObservationList} />
          <Route path="/add-observation/categories" component={Categories} />
          <Route path="/add-observation/details" component={AddObservation} />
          <Route path="/add-observation/fields" component={FieldsetForm} />
          <Route path="/add-observation/location" component={FieldsetForm} />
          <Route path="/account/observations" component={MyObservations} />
          <Route path="/account/about" component={About} />
          <Route path="/account/add-survey" component={AddSurvey} />
          <Route path="/account/profile" component={Profile} />
          <Route path="/account/settings" component={Settings} />
          <Route path="/account/surveys" component={Surveys} />
        </Switch>
      </NativeRouter>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(App);
