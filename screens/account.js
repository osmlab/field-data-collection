import React from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';

class AccountScreen extends React.Component {
  constructor () {
    super();
  }

  render () {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.observations}>
        <Text>
        This is a list of the users observations observation
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  observations: {}
});

export default AccountScreen;
