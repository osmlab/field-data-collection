import React from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';

import baseStyles from '../../styles';

class AddSurveyScreen extends React.Component {
  constructor () {
    super();
  }

  render () {
    const { navigate } = this.props.navigation;

    return (
      <View style={{ flex: 1 }}>
        <View style={baseStyles.container}>
          <View onPress={() => {}}>
            <Text> ← </Text>
          </View>

          <Text style={baseStyles.title}>
            Add a survey
          </Text>


        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({});

export default AddSurveyScreen;
