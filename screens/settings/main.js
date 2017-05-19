import React from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';

class MainSettingsScreen extends React.Component {
  constructor () {
    super();
  }

  render () {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.settings}>
        <Text>
        This is the settings page
        </Text>
        <Button
          onPress={() => this.props.navigation.navigate('About', {name: 'About'})}
          title="About"
        />
        <Button
          onPress={() => this.props.navigation.navigate('About', {name: 'About'})}
          title="Add a survey"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  settings: {}
});

export default MainSettingsScreen;
