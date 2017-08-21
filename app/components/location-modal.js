import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Button,
  Modal
} from "react-native";

import { Text, Map } from "./index";
import { baseStyles } from "../styles";

class LocationModal extends Component {
  render() {
    const { close } = this.props;

    return (
      <Modal animationType="slide" transparent visible onRequestClose={close}>
        <View style={[baseStyles.wrapperContentMd, baseStyles.modal]}>
          <View style={[baseStyles.wrappedItems]}>
            <Map height={300} />
          </View>
        </View>
      </Modal>
    );
  }
}

export default LocationModal;
