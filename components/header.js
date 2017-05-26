import React, { Component } from 'react';
import { Text, TextInput, View } from 'react-native';

import SearchBox from './search-box';

export default function Header (props) {
  function onChangeText (value) {
    console.log('onChangeText', value)
  }

  return (
    <View style={{ padding: 10, height: 60, borderBottomWidth: 1, borderColor: '#ccc', backgroundColor: 'white' }}>
      <View style={{ flex:1, flexDirection:'column', justifyContent: 'center', height: 30 }}>
        <View style={{ flexDirection:'row' }}>
          <SearchBox onChangeText={onChangeText} />
          <MapListToggle {...props} />
        </View>
      </View>
    </View>
  );
}

function MapListToggle (props) {
  console.log('MapListToggle', props)
  return (
    <View style={{ flex: 0.3, height: 30, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ textAlign: 'center' }} onPress={props.onTogglePress}>{props.button}</Text>
    </View>
  );
}
