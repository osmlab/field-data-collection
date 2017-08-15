import React, { Component } from "react";
import { StyleSheet, View, Button, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Link } from "react-router-native";

import { Text, Wrapper } from "../../components";
import { baseStyles } from "../../styles";

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 17
  }
});

class MainSettingsScreen extends Component {
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
        <Link to="/">
          <Icon
            name="keyboard-backspace"
            style={[[baseStyles.headerBackIcon]]}
          />
        </Link>
        <Text style={[baseStyles.h3, baseStyles.headerTitle]}>Settings</Text>
      </View>
    );

    return (
      <Wrapper headerView={headerView}>
        <View style={[baseStyles.wrapperContent]}>
          <View style={{ marginTop: 20, marginBottom: 20 }}>
            <Text style={styles.subtitle}>
              Settings information. We should think about what we want here.
            </Text>
          </View>
        </View>
      </Wrapper>
    );
  }
}

export default MainSettingsScreen;
