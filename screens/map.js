import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import Mapbox, { MapView } from 'react-native-mapbox-gl';
import osmp2p from '../osm-p2p';

Mapbox.setAccessToken('pk.eyJ1Ijoic2V0aHZpbmNlbnQiLCJhIjoiSXZZXzZnUSJ9.Nr_zKa-4Ztcmc1Ypl0k5nw');

class MapScreen extends React.Component {
  constructor () {
    super();
    this.navigationOptions = { tabBarLabel: 'Map' };
    this.state = {
      center: {
        latitude: 40.72052634,
        longitude: -73.97686958312988
      },
      zoom: 11,
      userTrackingMode: Mapbox.userTrackingMode.none
    };

    this.db = osmp2p();
    this.db.create({ id: 'A', lat: 64.5, lon: -147.6 }, (err, key, node) => {
      if (err) return console.error('error', err)
      console.log('key', key, 'node', node)
      this.db.get(key, function (err, val) {
        console.log('err', err, 'val', val)
      })
    });
  }

  render () {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <MapView
          ref={map => { this._map = map; }}
          style={styles.map}
          initialCenterCoordinate={this.state.center}
          initialZoomLevel={this.state.zoom}
          initialDirection={0}
          rotateEnabled
          scrollEnabled
          zoomEnabled
          showsUserLocation={false}
          styleURL={Mapbox.mapStyles.dark}
          userTrackingMode={this.state.userTrackingMode}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch'
  },
  map: {
    flex: 1
  }
});

export default MapScreen;

/*

*/
