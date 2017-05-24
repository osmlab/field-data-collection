import React from 'react';
import { StyleSheet, View, Button, Text, ListView } from 'react-native';

import Header from '../../components/header';

import baseStyles from '../../styles/index'

class ObservationListScreen extends React.Component {
  constructor () {
    super();

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => { r1 !== r2 }
    });

    this.state = {
      observations: ds.cloneWithRows([
        {
          category: 'Oil spill',
          surveyName: 'Survey name',
          observationName: 'Name of observation',
          updated: 'Sep. 2, 2016',
          lnglat: [47, -122],
          complete: 0.70
        },
        {
          category: 'Oil spill',
          surveyName: 'Survey name',
          observationName: 'Name of observation',
          updated: 'Sep. 2, 2016',
          lnglat: [47, -122],
          complete: 0.70
        },
        {
          category: 'Oil spill',
          surveyName: 'Survey name',
          observationName: 'Name of observation',
          updated: 'Sep. 2, 2016',
          lnglat: [47, -122],
          complete: 0.70
        }
      ]),
    };
  }

  render () {
    const { navigate } = this.props.navigation;

    return (
      <View style={{ flex: 1 }}>
        <Header
          button='map'
          onTogglePress={() => {
            navigate('ObservationMap')
          }}
        />

        <View style={baseStyles.container}>
          <ListView
            contentContainerStyle={styles.gridContainer}
            dataSource={this.state.observations}
            noScroll={true}
            renderRow={(item) => {
              return (
                <View style={styles.observation}>
                  <Text style={styles.muted}>{item.category} | {item.surveyName}</Text>
                  <Text style={styles.title}>{item.observationName}</Text>
                  <Text style={styles.muted}>Last updated: {item.updated}</Text>
                  <Text>Lat/Long: {item.lnglat}</Text>
                </View>
              );
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  observation: {
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 5
  },
  muted: {
    color: '#bbb'
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold'
  }
});

export default ObservationListScreen;
