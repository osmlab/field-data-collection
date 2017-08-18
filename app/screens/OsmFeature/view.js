import React, { Component } from "react";
import { Image, View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { Link } from "react-router-native";

import { Text, Wrapper, Map } from "../../components";
import { selectFeatureType } from "../../selectors";
import { baseStyles } from "../../styles";

class ViewOsmFeature extends Component {
  renderObservation = (observation, index) => {};

  render() {
    const headerView = (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center"
        }}
      >
        <TouchableOpacity onPress={history.goBack}>
          <Icon
            name="keyboard-backspace"
            style={[[baseStyles.headerBackIcon]]}
          />
        </TouchableOpacity>
        <Text style={[baseStyles.h3, baseStyles.headerTitle]}>
          osm feature view
        </Text>
      </View>
    );

    return <Wrapper headerView={headerView} />;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {};
};

export default connect(mapStateToProps)(ViewOsmFeature);
