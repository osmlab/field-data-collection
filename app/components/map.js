import React, { Component } from "react";
import { StyleSheet, View, ListView, TouchableOpacity } from "react-native";
import Mapbox, { MapView } from "react-native-mapbox-gl";

import config from "../config";

Mapbox.setAccessToken(config.mapboxAccessToken);

class Map extends Component {
  componentWillMount() {}

  render() {
    const { observation } = this.props;

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
          styleURL={Mapbox.mapStyles.light}
          attributionButtonIsHidden={true}
          logoIsHidden={true}
        >
          {this.props.children}
        </MapView>
      </View>
    );
  }
}

export default Map;
