import React, { Component } from "react";
import { TextInput, View, TouchableHighlight } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import Text from "./text";
import { colors } from "../styles";

export default function Header(props) {
  return (
    <View
      style={{
        padding: 10,
        paddingLeft: 20,
        paddingRight: 15,
        height: 60,
        borderBottomWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "white"
      }}
    >
      <View style={{ flex: 1, height: 30 }}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          {props.children}
          <MapListToggle {...props} />
        </View>
      </View>
    </View>
  );
}

function MapListToggle(props) {
  return (
    <View style={{ flex: 0.2, height: 30, alignSelf: "stretch" }}>
      <Text style={{ textAlign: "right" }} onPress={props.onTogglePress}>
        <Icon
          name="menu"
          style={{ fontSize: 35, color: colors.interface.links }}
        />
      </Text>
    </View>
  );
}
