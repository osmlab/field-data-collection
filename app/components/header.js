import React, { Component } from "react";
import { TextInput, View, TouchableHighlight } from "react-native";
import FontAwesome, { Icons } from "react-native-fontawesome";

import Text from "./text";
import { colors } from "../styles";

export default function Header(props) {
  return (
    <View
      style={{
        padding: 10,
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
    <View style={{ flex: 0.3, height: 30, justifyContent: "center" }}>
      <Text style={{ textAlign: "right" }} onPress={props.onTogglePress}>
        <FontAwesome style={{ fontSize: 25, color: colors.interface.links }}>
          {Icons.bars}
        </FontAwesome>
      </Text>
    </View>
  );
}
