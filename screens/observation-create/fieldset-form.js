import React from 'react';
import { StyleSheet, View, Button, Text, TextInput, TouchableHighlight } from 'react-native';
import { NavigationActions } from 'react-navigation'

import baseStyles from '../../styles/index';

class FieldsetFormScreen extends React.Component {
  constructor (params) {
    super();

    this.state = {
      fieldset: params.navigation.state.params.fieldset
    }
  }

  render () {
    const { navigate } = this.props.navigation;
    const { fieldset } = this.state;
    let input;

    const onClosePress = () => {
      const backAction = NavigationActions.back()
      this.props.navigation.dispatch(backAction)
    }

    return (
      <View style={baseStyles.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={baseStyles.title}>
              {fieldset.title}
            </Text>
            <Text style={{ fontSize: 25 }} onPress={onClosePress}>
              ⅹ
            </Text>
        </View>
        <Text>Question 1/4</Text>

        <View style={{marginTop: 20}}>
          <Text style={{fontWeight: 'bold', fontSize: 17}}>Label</Text>
          <Text style={{color: '#aaa'}}>Help text</Text>
          <TextInput
            ref={(c) => input = c}
            style={{backgroundColor: 'white', borderColor: '#ccc', borderWidth: 1, padding: 6, paddingLeft: 10, borderRadius: 2, marginTop: 5, height: 35}}
            placeholder='placeholder'
            placeholderTextColor='#ccc'
            underlineColorAndroid='transparent'
            onSubmitEditing={() => input.blur()}
            onChangeText={(val) => console.log('field value', val)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

});

export default FieldsetFormScreen;
