import React, { Component } from "react";
import { StyleSheet, View, ListView, TouchableOpacity } from "react-native";
import Mapbox, { MapView } from "react-native-mapbox-gl";

Mapbox.setAccessToken(
  "pk.eyJ1Ijoic2V0aHZpbmNlbnQiLCJhIjoiSXZZXzZnUSJ9.Nr_zKa-4Ztcmc1Ypl0k5nw"
);

class Map extends Component {
  componentWillMount() {}

  render() {
    return (
      <View style={{ height: 100 }}>
        <MapView
          ref={map => (this._map = map)}
          style={{ flex: 1, top: 0, bottom: 0 }}
          debugActive={true}
          direction={10}
          compassIsHidden={false}
          initialCenterCoordinate={this.props.center}
          initialZoomLevel={this.props.zoom}
          rotateEnabled={false}
          scrollEnabled={true}
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
