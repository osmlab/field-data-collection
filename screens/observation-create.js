import React from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';

class ObservationCreateScreen extends React.Component {
  constructor () {
    super();
  }

  render () {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.form}>
        <Text>
        This is the observation form
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  form: {}
});

export default ObservationCreateScreen;
