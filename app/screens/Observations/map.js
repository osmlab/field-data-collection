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

import osmp2p from "../../lib/osm-p2p";
import { Header, SideMenu, Text } from "../../components";
import { baseStyles } from "../../styles";

import FontAwesome, { Icons } from "react-native-fontawesome";

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
    zIndex: 1002,
    position: "absolute",
    bottom: 10,
    right: 10
  },
  buttonLegend: {
    width: 30,
    height: 30,
    borderRadius: 80,
    backgroundColor: "#6579FC",
    zIndex: 1002,
    position: "absolute",
    top: 90,
    right: 10
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
    this._osm = osmp2p();
  }

  componentWillMount() {
    this.setState({
      center: {
        latitude: 47.6685,
        longitude: -122.384
      },
      zoom: 16,
      userTrackingMode: Mapbox.userTrackingMode.none,
      annotations: []
    });
  }

  onMenuPress = () => {
    this._menu.open();
  };

  onClosePress() {
    //
  }

  onMapPress = e => {
    console.log("event", e);
    // const x = e.screenCoordX;
    // const y = e.screenCoordY;
    //
    // this._map.queryRenderedFeatures({
    //   rect: {
    //     left: x - 22,
    //     top: y - 22,
    //     right: x + 22,
    //     bottom: y + 22
    //   }
    // }, function (features) {
    //   console.log(features)
    // });
  };

  prepareAnnotations = () => {
    this._map.getBounds(data => {
      var q = [[data[0], data[2]], [data[1], data[3]]];

      this._osm.createAnnotationStream(q, (err, annotations) => {
        console.log("annotations", annotations);
        if (annotations) {
          this.setState({ annotations });
        }
      });
    });
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={[baseStyles.wrapper, { padding: 0 }]}>
        <Header onTogglePress={this.onMenuPress} />
        <SideMenu
          ref={menu => {
            this._menu = menu;
          }}
          navigation={this.props.navigation}
          osm={this._osm}
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
          <FontAwesome
            style={{
              paddingTop: 7,
              paddingLeft: 12,
              fontSize: 15,
              color: "#ffffff"
            }}
          >
            {Icons.info}
          </FontAwesome>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonAdd]}
          onPress={() => {
            navigate("Categories");
          }}
        >
          <FontAwesome
            style={{
              paddingTop: 18,
              paddingLeft: 20,
              fontSize: 25,
              color: "#ffffff"
            }}
          >
            {Icons.plus}
          </FontAwesome>
        </TouchableOpacity>
      </View>
    );
  }
}

export default ObservationMapScreen;
