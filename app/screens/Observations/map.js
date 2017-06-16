import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import Mapbox, { MapView } from "react-native-mapbox-gl";

import { Header } from "../../components";
import { baseStyles } from "../../styles";
import osmp2p from "../../lib/osm-p2p";

Mapbox.setAccessToken(
  "pk.eyJ1Ijoic2V0aHZpbmNlbnQiLCJhIjoiSXZZXzZnUSJ9.Nr_zKa-4Ztcmc1Ypl0k5nw"
);

const styles = StyleSheet.create({
  map: {
    flex: 1
  }
});

class ObservationMapScreen extends Component {
  constructor() {
    super();

    this.osm = osmp2p();
    this.navigationOptions = { tabBarLabel: "Map" };
  }

  componentWillMount() {
    this.setState({
      center: {
        latitude: 40.72052634,
        longitude: -73.97686958312988
      },
      zoom: 11,
      userTrackingMode: Mapbox.userTrackingMode.none
    });
  }

  componentDidMount() {
    console.log("map", this._map);
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={[baseStyles.wrapper, { padding: 0 }]}>
        <Header
          button="list"
          onTogglePress={() => {
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
      </View>
    );
  }
}

export default ObservationMapScreen;
