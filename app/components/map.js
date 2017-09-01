import debounce from "debounce";
import React, { Component } from "react";
import { View } from "react-native";
import Mapbox, { MapView } from "react-native-mapbox-gl";
import Icon from "react-native-vector-icons/MaterialIcons";

import Geolocate from "./geolocate";
import config from "../config";

Mapbox.setAccessToken(config.mapboxAccessToken);

class Map extends Component {
  componentWillMount() {}

  onGeolocate = (err, data) => {
    if (data) {
      this.setState({ userLocation: data.coords });

      this._map.setCenterCoordinate(
        data.coords.latitude,
        data.coords.longitude,
        true
      );
    }
  };

  setRef = map => {
    const { mapref } = this.props;
    if (mapref) mapref(map);
    this._map = map;
  };

  render() {
    const {
      center,
      geolocateIcon,
      newPointPin,
      onRegionDidChange
    } = this.props;

    const optional = {};

    if (center) {
      optional.initialCenterCoordinate = center;
    }

    if (onRegionDidChange) {
      optional.onRegionDidChange = debounce(onRegionDidChange, 400);
    }

    return (
      <View style={{ height: this.props.height || 100 }}>
        <MapView
          ref={this.setRef}
          style={{ flex: 1, top: 0, bottom: 0 }}
          compassIsHidden={false}
          initialZoomLevel={this.props.zoom || 16}
          rotateEnabled={false}
          scrollEnabled
          zoomEnabled
          showsUserLocation
          styleURL={Mapbox.mapStyles.light}
          userTrackingMode={
            !!this.props.center
              ? Mapbox.userTrackingMode.none
              : Mapbox.userTrackingMode.followWithHeading
          }
          attributionButtonIsHidden
          logoIsHidden
          {...optional}
        >
          {this.props.children}
        </MapView>

        {newPointPin &&
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            }}
          >
            <Icon
              name="location-on"
              size={30}
              style={{ color: "#6579fc", marginTop: -25 }}
            />
          </View>}

        {geolocateIcon &&
          <View
            style={{
              position: "absolute",
              right: 15,
              bottom: 85
            }}
          >
            <Geolocate onGeolocate={this.onGeolocate} />
          </View>}
      </View>
    );
  }
}

export default Map;
