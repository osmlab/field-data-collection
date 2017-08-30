import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Button,
  Modal
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Text, Map } from "./index";
import { baseStyles } from "../styles";

const screenHeight = Dimensions.get("window").height;

class LocationModal extends Component {
  setRef = map => {
    this._map = map;
  };

  render() {
    const { close, updateObservation, onUpdateLocation } = this.props;

    return (
      <Modal animationType="slide" transparent visible onRequestClose={close}>
        <View style={[baseStyles.modalBg]}>
          <View style={[baseStyles.modal]}>
            <View
              style={[
                baseStyles.wrapperContentMdHeader,
                baseStyles.wrappedItems
              ]}
            >
              <Text style={[baseStyles.h2, baseStyles.wrappedItemsLeft]}>
                Choose location
              </Text>

              <TouchableOpacity onPress={close}>
                <Icon name="clear" style={[[baseStyles.clearIcon]]} />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
              <Map
                height={screenHeight - 130}
                mapref={this.setRef}
                geolocateIcon
                newPointPin
              />

              <TouchableOpacity
                style={baseStyles.buttonBottom}
                onPress={() => {
                  this._map.getCenterCoordinateZoomLevel(data => {
                    onUpdateLocation(data);
                    close();
                  });
                }}
              >
                <Text style={{ color: "#ffffff" }}>SAVE LOCATION</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export default LocationModal;
