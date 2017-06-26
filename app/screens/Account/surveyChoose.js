import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Button,
  TouchableOpacity,
  Modal,
  TouchableHighlight
} from "react-native";
import { NavigationActions } from "react-navigation";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Text, Wrapper } from "../../components";
import { baseStyles } from "../../styles";

class SurveyModal extends Component {
  state = {
    modalVisible: true
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    const onBackPress = () => {
      const backAction = NavigationActions.back();
      this.props.navigation.dispatch(backAction);
    };

    return (
      <View>
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert("Modal has been closed.");
          }}
        >
          <View style={[baseStyles.wrapperContentMd, baseStyles.modal]}>
            <View style={[baseStyles.wrappedItems]}>
              <Text style={[baseStyles.h2, baseStyles.wrappedItemsLeft]}>
                Add Surveys
              </Text>
              <TouchableOpacity onPress={onBackPress}>
                <Icon name="clear" style={[[baseStyles.clearIcon]]} />
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity style={[baseStyles.touchableLinksWrapper]}>
                <Text style={[baseStyles.touchableLinks]}>Survey 1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[baseStyles.touchableLinksWrapper]}>
                <Text style={[baseStyles.touchableLinks]}>Survey 2</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[baseStyles.touchableLinksWrapper]}>
                <Text style={[baseStyles.touchableLinks]}>Survey 3</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[baseStyles.touchableLinksWrapper]}>
                <Text style={[baseStyles.touchableLinks]}>Survey 4</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[baseStyles.buttonBottom]}>
              <Text style={[baseStyles.textWhite]}>
                {"Submit".toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}

export default SurveyModal;
