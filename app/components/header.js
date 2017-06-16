import React, { Component } from "react";
import { TextInput, View, TouchableHighlight } from "react-native";

import Text from "./text";
import SearchBox from "./search-box";

export default function Header(props) {
  function onChangeText(value) {
    console.log("onChangeText", value);
  }

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
          <Text>Field Data Collection</Text>
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
        🍔
      </Text>
    </View>
  );
}
