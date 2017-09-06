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

const screen = Dimensions.get("window");

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
              <Text style={[baseStyles.h3, baseStyles.wrappedItemsLeft]}>
                Choose location
              </Text>

              <TouchableOpacity onPress={close}>
                <Icon name="clear" style={[[baseStyles.clearIcon]]} />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
              <Map
                height={screen.height - 180}
                mapref={this.setRef}
                geolocateIcon
                newPointPin
              />
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  flexDirection: "row"
                }}
              >
                <TouchableOpacity
                  style={[baseStyles.buttonBottom, { width: screen.width }]}
                  onPress={() => {
                    this._map.getCenterCoordinateZoomLevel(data => {
                      onUpdateLocation(data);
                      close();
                    });
                  }}
                >
                  <Text style={baseStyles.textWhite}>SAVE LOCATION</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export default LocationModal;
