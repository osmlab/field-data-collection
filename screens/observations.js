import React from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';

class ObservationsScreen extends React.Component {
  constructor () {
    super();
    this.navigationOptions = { tabBarLabel: 'Map' };
  }

  render () {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.observations}>
        <Text>
        This is a list of observations
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  observations: {}
});

export default ObservationsScreen;
