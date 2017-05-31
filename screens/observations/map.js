import React, { Component } from "react";
import { StyleSheet, View, Button } from "react-native";
import Mapbox, { MapView } from "react-native-mapbox-gl";

import { Text, Header, Wrapper } from "../../components";
import { baseStyles } from "../../styles";

Mapbox.setAccessToken(
  "pk.eyJ1Ijoic2V0aHZpbmNlbnQiLCJhIjoiSXZZXzZnUSJ9.Nr_zKa-4Ztcmc1Ypl0k5nw"
);

class ObservationMapScreen extends Component {
  constructor() {
    super();
    this.navigationOptions = { tabBarLabel: "Map" };
    this.state = {
      center: {
        latitude: 40.72052634,
        longitude: -73.97686958312988
      },
      zoom: 11,
      userTrackingMode: Mapbox.userTrackingMode.none
    };
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <Wrapper style={{ padding: 0 }}>
        <Header
          button="list"
          onTogglePress={() => {
            console.log("toggggggggggggggggggggggggggggggggg");
            navigate("ObservationList");
          }}
        />

        <MapView
          ref={map => {
            this._map = map;
          }}
          style={styles.map}
          initialCenterCoordinate={this.state.center}
          initialZoomLevel={this.state.zoom}
          initialDirection={0}
          rotateEnabled={false}
          scrollEnabled
          zoomEnabled
          showsUserLocation={false}
          styleURL={Mapbox.mapStyles.light}
          userTrackingMode={this.state.userTrackingMode}
        />
      </Wrapper>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  }
});

export default ObservationMapScreen;
