import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Image
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";

import { StatusBar, Text } from "../../components";
import { baseStyles } from "../../styles";

const styles = StyleSheet.create({
  cover: {
    width: 22,
    height: 28,
    marginRight: 20
  }
});

class LegendModal extends Component {
  render() {
    const { close } = this.props;

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
                Legend
              </Text>
              <TouchableOpacity onPress={close}>
                <Icon name="clear" style={[[baseStyles.clearIcon]]} />
              </TouchableOpacity>
            </View>
            <View style={[baseStyles.wrapperContent]}>
              <View style={[baseStyles.wrappedItems, baseStyles.spaceBelow]}>
                <Image
                  style={styles.cover}
                  source={require("../../location-legend.png")}
                />
                <Text sytle={[baseStyles.h4]}>Your Location</Text>
              </View>
              <View style={[baseStyles.wrappedItems, baseStyles.spaceBelow]}>
                <Image
                  style={styles.cover}
                  source={require("../../observation-1.png")}
                />
                <Text sytle={[baseStyles.h4]}>Your Observations</Text>
              </View>
              <View style={[baseStyles.wrappedItems, baseStyles.spaceBelow]}>
                <Image
                  style={styles.cover}
                  source={require("../../observation-2.png")}
                />
                <Text sytle={[baseStyles.h4]}>Observations Made by Others</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export default LegendModal;
