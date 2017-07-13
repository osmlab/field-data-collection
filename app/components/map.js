import React, { Component } from "react";
import { StyleSheet, View, ListView, TouchableOpacity } from "react-native";
import Mapbox, { MapView } from "react-native-mapbox-gl";

Mapbox.setAccessToken(
  "pk.eyJ1Ijoic2V0aHZpbmNlbnQiLCJhIjoiSXZZXzZnUSJ9.Nr_zKa-4Ztcmc1Ypl0k5nw"
);

class Map extends Component {
  componentWillMount() {
    this.setState({
      center: {
        latitude: 47.6685,
        longitude: -122.384
      },
      zoom: 16
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          ref={map => {
            this._map = map;
          }}
          style={{ height: 100, flex: 1 }}
          initialCenterCoordinate={this.props.center}
          initialZoomLevel={this.props.zoom}
          rotateEnabled={false}
          scrollEnabled={false}
          zoomEnabled={false}
          showsUserLocation={true}
          styleURL="https://openmaptiles.github.io/osm-bright-gl-style/style-cdn.json"
          userTrackingMode={Mapbox.userTrackingMode.followWithCourse}
        />
      </View>
    );
  }
}

export default Map;
