import React, { Component } from "react";
import { StyleSheet, View, Button, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Text, Wrapper } from "../../components";
import { baseStyles } from "../../styles";

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 17
  }
});

class ProfileScreen extends Component {
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
        <Text style={[baseStyles.h3, baseStyles.headerTitle]}>Profile</Text>
      </View>
    );

    return (
      <Wrapper headerView={headerView}>
        <View style={[baseStyles.wrapperContent]}>
          <View style={{ marginTop: 20, marginBottom: 20 }}>
            <Text style={styles.subtitle}>
              Enter your information for your edits to be associated to you.
            </Text>
          </View>
          <View style={{ marginTop: 20, marginBottom: 20 }}>
            <Text style={styles.subtitle}>
              Enter your information for your edits to be associated to you.
            </Text>
          </View>
        </View>
      </Wrapper>
    );
  }
}

export default ProfileScreen;
