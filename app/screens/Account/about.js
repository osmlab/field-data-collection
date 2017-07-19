import React, { Component } from "react";
import { StyleSheet, View, Button, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Text, Wrapper } from "../../components";
import { baseStyles } from "../../styles";

class AboutScreen extends Component {
  render() {
    const { history } = this.props;

    const headerView = (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center"
        }}
      >
        <TouchableOpacity onPress={history.goBack}>
          <Icon
            name="keyboard-backspace"
            style={[[baseStyles.headerBackIcon]]}
          />
        </TouchableOpacity>
        <Text style={[baseStyles.h3, baseStyles.headerTitle]}>About</Text>
      </View>
    );

    return (
      <Wrapper headerView={headerView}>
        <View style={[baseStyles.wrapperContent]}>
          <Text>This is the about page</Text>
        </View>
      </Wrapper>
    );
  }
}

export default AboutScreen;
