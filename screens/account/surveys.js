import React from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import { NavigationActions } from 'react-navigation'

import baseStyles from '../../styles/index';

class SurveysScreen extends React.Component {
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
            <Text style={[baseStyles.title]}>Surveys</Text>
          </View>

          <View style={{ marginTop:20, marginBottom: 20 }}>
            <Text style={styles.subtitle}>
              Some text about surveys to read.
            </Text>
          </View>
        </View>

        <View style={{flex:1}}>
        <Button
          style={{flex:1}}
          onPress={() => {}}
          title="Survey 1"
        />
        <Button
          style={{flex:1}}
          onPress={() => {}}
          title="Survey 2"
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

export default SurveysScreen;
