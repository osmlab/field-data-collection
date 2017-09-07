import React, { Component } from "react";
import { View, Dimensions, TouchableOpacity, Modal } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { CategoryList, Text } from "./index";
import { baseStyles } from "../styles";

class ObservationTypeModal extends Component {
  render() {
    const { categories, close, onSelect } = this.props;

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
                Observation type
              </Text>

              <TouchableOpacity onPress={close}>
                <Icon name="clear" style={[[baseStyles.clearIcon]]} />
              </TouchableOpacity>
            </View>

            <View style={{ marginLeft: 0, paddingLeft: 0 }}>
              <CategoryList categories={categories} onSelect={onSelect} />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export default ObservationTypeModal;
