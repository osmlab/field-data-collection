import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Button,
  Dimensions,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import Mapbox, { MapView } from "react-native-mapbox-gl";
import Icon from "react-native-vector-icons/MaterialIcons";

import createOsmp2p from "../../lib/create-osm-p2p";
import osmp2p from "../../lib/osm-p2p";
import { Header, SideMenu, Text, Geolocate } from "../../components";
import { baseStyles, colors } from "../../styles";

Mapbox.setAccessToken(
  "pk.eyJ1Ijoic2V0aHZpbmNlbnQiLCJhIjoiSXZZXzZnUSJ9.Nr_zKa-4Ztcmc1Ypl0k5nw"
);

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  buttonAdd: {
    width: 60,
    height: 60,
    borderRadius: 80,
    backgroundColor: "#8212C6",
    zIndex: 10,
    position: "absolute",
    bottom: 10,
    right: 15
  },
  buttonLegend: {
    zIndex: 1002,
    position: "absolute",
    top: 80,
    right: 15,
    zIndex: 10
  },
  header: {
    height: 60,
    paddingLeft: 20,
    flexDirection: "row",
    backgroundColor: "red",
    alignItems: "center",
    zIndex: 1001
  }
});

class ObservationMapScreen extends Component {
  constructor() {
    super();

    this.navigationOptions = { tabBarLabel: "Map" };
  }

  componentWillMount() {
    this.setState({
      center: {
        latitude: 47.6685,
        longitude: -122.384
      },
      zoom: 16,
      userTrackingMode: Mapbox.userTrackingMode.followWithCourse,
      annotations: [],
      mapSize: { width: null, height: null }
    });
  }

  componentWillUnmount() {
    console.log("componentWillUnmount");
  }

  onMenuPress = () => {
    this._menu.open();
  };

  onClosePress() {
    //
  }

  onMapPress = e => {
    const x = e.screenCoordX;
    const y = e.screenCoordY;

    const rect = {
      top: y - 50,
      right: x + 50,
      bottom: y + 50,
      left: x - 50
    };

    this._map.getBoundsFromScreenCoordinates(rect, bounds => {
      console.log("bounds from screenCoords", bounds);
      // TODO: trigger action fetching points within bounds
    });
  };

  prepareAnnotations = () => {
    this._map.getBounds(data => {
      var q = [[data[0], data[2]], [data[1], data[3]]];

      // TODO: trigger action fetching points within bounds
    });
  };

  onGeolocate = (err, data) => {
    this._map.setCenterCoordinate(
      data.coords.latitude,
      data.coords.longitude,
      true
    );
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={[baseStyles.wrapper, { padding: 0 }]}>
        <Header onTogglePress={this.onMenuPress}>
          <Text>Observe</Text>
        </Header>

        <SideMenu
          ref={menu => {
            this._menu = menu;
          }}
          navigation={this.props.navigation}
          onSync={this.prepareAnnotations}
        />

        <MapView
          ref={map => {
            this._map = map;
          }}
          style={styles.map}
          annotations={this.state.annotations}
          onFinishLoadingMap={this.prepareAnnotations}
          onTap={this.onMapPress}
          onOpenAnnotation={this.onMapPress}
          onLayout={e => {
            const { nativeEvent: { layout: { height, width } } } = e;
            this.state.mapSize.height = height;
            this.state.mapSize.width = width;
          }}
          initialCenterCoordinate={this.state.center}
          initialZoomLevel={this.state.zoom}
          initialDirection={0}
          rotateEnabled={false}
          scrollEnabled
          zoomEnabled
          showsUserLocation={false}
          styleURL="https://openmaptiles.github.io/osm-bright-gl-style/style-cdn.json"
          userTrackingMode={this.state.userTrackingMode}
        />
        <TouchableOpacity
          style={[styles.buttonLegend]}
          onPress={this._onPressButton}
        >
          <Icon
            name="info"
            style={{
              paddingTop: 7,
              paddingLeft: 12,
              fontSize: 35,
              color: colors.interface.headerBackground
            }}
          />
        </TouchableOpacity>

        <Geolocate onGeolocate={this.onGeolocate} />

        <TouchableOpacity
          style={[styles.buttonAdd]}
          onPress={() => {
            navigate("Categories");
          }}
        >
          <Icon
            name="add"
            style={{
              paddingTop: 10,
              paddingLeft: 10,
              fontSize: 40,
              color: "#ffffff"
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

export default ObservationMapScreen;
