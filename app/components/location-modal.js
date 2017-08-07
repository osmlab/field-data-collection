import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Button
} from "react-native";

import { Text } from "./index";

import { baseStyles } from "../styles";

const styles = StyleSheet.create({
  ModalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    zIndex: 1005,
    borderLeftWidth: 0.5
  },
  Modal: {
    left: 0,
    width: ModalWidth,
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    elevation: 10
  }
});

class Modal extends Component {
  componentWillMount() {
    this.setState({
      modalOpen: false
    });
  }

  open = () => {
    this.setState({
      modalOpen: true
    });
  };

  close = () => {
    this.setState({
      modalOpen: false
    });
  };

  render() {
    return (
      <View style={styles.ModalContainer} pointerEvents="box-none">
        {this.state.menuOpen &&
          <TouchableOpacity
            style={[
              styles.ModalContainer,
              { backgroundColor: "rgba(0,0,0,.8)", zIndex: 1004 }
            ]}
            activeOpacity={0.8}
            onPress={e => {
              this.close();
            }}
          />}

        <View>
          {this.props.children}
        </View>
      </View>
    );
  }
}

export default Modal;
