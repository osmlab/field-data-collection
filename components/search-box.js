import React, { Component } from "react";
import { TextInput, View } from "react-native";

import Text from "./text";

export default function searchBox(props) {
  const onChangeText = props.onChangeText;
  let input;

  return (
    <View
      style={{
        flex: 0.7,
        borderWidth: 1,
        paddingLeft: 10,
        paddingRight: 10,
        borderColor: "#ccc"
      }}
    >
      <TextInput
        ref={c => (input = c)}
        placeholder="Filter by points of interest"
        underlineColorAndroid="transparent"
        inlineImagePadding={30}
        onSubmitEditing={() => input.blur()}
        onChangeText={onChangeText}
      />
    </View>
  );
}
