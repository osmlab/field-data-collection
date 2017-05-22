import React, { Component } from 'react';
import { Text, TextInput, View } from 'react-native';

export default function searchBox (props) {
  const onChangeText = props.onChangeText;
  let input;

  return (
    <View style={{ flex:1, flexDirection:'column', justifyContent: 'center', height: 30 }}>
      <View style={{ flexDirection:'row' }}>
        <View style={{ flex: 0.7, borderWidth: 1, paddingLeft: 10, paddingRight: 10, borderColor: '#ccc' }}>
          <TextInput
            ref={c => (input = c)}
            placeholder='Filter by points of interest'
            underlineColorAndroid='transparent'
            inlineImagePadding={30}
            onSubmitEditing={() => input.blur()}
            onChangeText={onChangeText}
          />
        </View>
        <View style={{ flex: 0.3, height: 30, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ textAlign: 'center' }}>List</Text>
        </View>
      </View>
    </View>
  );
}
