import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";

import { selectStatus } from "../selectors";
import Text from "./text";

class StatusBar extends Component {
  render() {
    const { status: { error, message } } = this.props;

    if (!message && !error) {
      return null;
    }

    return (
      <View>
        <Text>
          {message}{error && `: ${error}`}
        </Text>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  status: selectStatus(state)
});

export default connect(mapStateToProps)(StatusBar);
