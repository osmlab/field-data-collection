import React from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';

class ObservationScreen extends React.Component {
  constructor () {
    super();
  }

  render () {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.observation}>
        <Text>
        This is an observation
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  observation: {}
});

export default ObservationScreen;
