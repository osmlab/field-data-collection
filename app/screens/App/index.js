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

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

class App extends Component {
  render() {
    return (
      <NativeRouter>
        <Switch>
          <Route path="/" exact component={ObservationMap} />
          <Route path="/account/observations" component={MyObservations} />
        </Switch>
      </NativeRouter>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(App);
