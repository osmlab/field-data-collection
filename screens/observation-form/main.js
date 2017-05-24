import React from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';

class ObservationFormMainScreen extends React.Component {
  constructor () {
    super();
  }

  render () {
    const { navigate } = this.props.navigation;

    return (
      <View>
        <Text>
          This is the screen for choosing the category of an observation
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({});

export default ObservationFormMainScreen;
