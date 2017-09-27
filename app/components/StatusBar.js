import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";

import { selectStatus } from "../selectors";
import { clearStatus } from "../actions";

import Text from "./text";

class StatusBar extends Component {
  state = {
    open: true
  };

  close = () => {
    this.setState({ open: false });
    this.props.clearStatus();
  };

  componentWillReceiveProps() {
    const { status: { error, message } } = this.props;

    if (message || error) {
      this.setState({ open: true });
    }
  }

  render() {
    const { status: { error, message } } = this.props;

    if ((!message && !error) || !this.state.open) {
      return null;
    }

    const bg = error ? "#FF5C3F" : "rgb(78, 94, 189)";

    const messageComponent =
      typeof message === "object"
        ? message
        : <Text style={{ color: "#ffffff" }}>
            {message}
            {error && `: ${error}`}
          </Text>;

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
          zIndex: 1000,
          flexDirection: "row",
          justifyContent: "space-between"
        }}
      >
        {messageComponent}
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

export default connect(mapStateToProps, { clearStatus })(StatusBar);
