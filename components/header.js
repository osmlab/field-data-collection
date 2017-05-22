import React, { Component } from 'react';
import { Text, TextInput, View } from 'react-native';

import SearchBox from './search-box';

export default function Header (props) {
  function onChangeText (value) {
    console.log('onChangeText', value)
  }

  return (
    <View style={{ padding: 10, height: 60, borderBottomWidth: 1, borderColor: '#ccc' }}>
      <SearchBox onChangeText={onChangeText} />
    </View>
  );
}
