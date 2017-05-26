import React from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import { NavigationActions } from 'react-navigation'

import baseStyles from '../../styles/index';

class MainSettingsScreen extends React.Component {
  constructor () {
    super();
  }

  render () {
    const { navigate } = this.props.navigation;

    const onBackPress = () => {
      const backAction = NavigationActions.back()
      this.props.navigation.dispatch(backAction)
    }

    return (
      <View style={{flex:1}}>
        <View style={baseStyles.container}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Text style={{fontSize:30, marginTop: -10, marginRight: 5}} onPress={onBackPress}>←</Text>
            <Text style={[baseStyles.title]}>Settings</Text>
          </View>

          <View style={{ marginTop:20, marginBottom: 20 }}>
            <Text style={styles.subtitle}>
              Enter your information for your edits to be associated to you.
            </Text>
          </View>
        </View>

        <View style={{flex:1}}>
          <Button
            style={{flex:1}}
            onPress={() => navigate('About')}
            title="About"
          />
          <Button
            style={{flex:1}}
            onPress={() => navigate('Surveys')}
            title="Surveys"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 17
  }
});

export default MainSettingsScreen;
