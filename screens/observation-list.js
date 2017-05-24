import React from 'react';
import { StyleSheet, View, Button, Text, ListView } from 'react-native';

import Header from '../components/header';

import baseStyles from '../../styles/index'

class ObservationListScreen extends React.Component {
  constructor () {
    super();

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => { r1 !== r2 }
    });

    this.state = {
      observations: ds.cloneWithRows([]),
    };
  }

  render () {
    const { navigate } = this.props.navigation;

    return (
      <View style={baseStyles.container}>
        <Header
          button='map'
          onTogglePress={() => {
            navigate('Map')
          }}
        />

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

export default ObservationListScreen;
