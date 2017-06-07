import React, { Component } from "react";
import { BackHandler } from "react-native";
import { addNavigationHelpers, NavigationActions } from "react-navigation";
import { connect } from "react-redux";

import Navigator from "./navigator";

const mapStateToProps = state => {
  return {
    navigationState: state.app
  };
};

class App extends Component {
  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }

  componentWillUmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  shouldCloseApp(nav) {
    return nav.index === 0;
  }

  onBackPress = () => {
    const { dispatch, navigationState } = this.props;

    if (this.shouldCloseApp(navigationState)) {
      return false;
    }

    dispatch(NavigationActions.back());

    return true;
  };

  render() {
    const { dispatch, navigationState } = this.props;

    return (
      <Navigator
        navigation={addNavigationHelpers({
          dispatch,
          state: navigationState
        })}
      />
    );
  }
}

export default connect(mapStateToProps)(App);
