import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";

import { selectStatus } from "../selectors";
import { baseStyles } from "../styles";
import Text from "./text";

class StatusBar extends Component {
  componentWillMount() {
    const { status } = this.props;
    this.setState({ open: false });
  }

  close = () => {
    this.setState({ open: false });
  };

  componentWillReceiveProps() {
    const { status: { error, message } } = this.props;
    if (message || error) {
      this.setState({ open: true });
    }
  }

  render() {
    const { status: { error, message } } = this.props;

    if (!this.state.open || (!message && !error)) {
      return null;
    }

    const bg = error ? "#FF5C3F" : "rgb(78, 94, 189)";

    return (
      <View
        style={{
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 20,
          paddingRight: 15,
          backgroundColor: bg,
          position: "absolute",
          top: 60,
          right: 0,
          left: 0,
          zIndex: 2000,
          flexDirection: "row",
          justifyContent: "space-between"
        }}
      >
        <Text style={{ color: "#ffffff" }}>
          {message}
          {error && `: ${error}`}
        </Text>

        <TouchableOpacity onPress={this.close}>
          <Icon
            name="clear"
            style={[
              {
                fontSize: 20,
                color: "#ffffff"
              }
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  status: selectStatus(state)
});

export default connect(mapStateToProps)(StatusBar);
