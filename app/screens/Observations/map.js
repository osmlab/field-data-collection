import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Button,
  Dimensions,
  TouchableOpacity
} from "react-native";
import Mapbox, { MapView } from "react-native-mapbox-gl";

import Interactable from "react-native-interactable";

import { Header, Text } from "../../components";
import { baseStyles } from "../../styles";
import osmp2p from "../../lib/osm-p2p";

import FontAwesome, { Icons } from "react-native-fontawesome";

const Screen = Dimensions.get("window");
const SideMenuWidth = 280;
const RemainingWidth = Screen.width - SideMenuWidth;

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
  sideMenuContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    zIndex: 1002,
    borderLeftWidth: 0.5
  },
  sideMenu: {
    left: 0,
    width: SideMenuWidth,
    flex: 1,
    backgroundColor: "#fff"
  },
  sideMenuTitle: {
    marginBottom: 20
  },
  header: {
    height: 60,
    paddingLeft: 20,
    flexDirection: "row",
    backgroundColor: "red",
    alignItems: "center",
    zIndex: 1001
  },
  body: {
    flex: 1,
    zIndex: 1000,
    alignItems: "center",
    justifyContent: "center"
  },
  menuIcon: {
    width: 30,
    height: 30
  },
  headerTitle: {
    marginLeft: 30,
    color: "white",
    fontSize: 20
  },
  content: {
    fontSize: 18
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

  onMenuPress() {
    this.refs["menuInstance"].setVelocity({ x: -2000 });
  }

  onClosePress() {
    this.refs["menuInstance"].setVelocity({ x: 3000 });
  }

  componentDidMount() {
    console.log("map", this._map);
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={[baseStyles.wrapper, { padding: 0 }]}>
        <Header onTogglePress={this.onMenuPress.bind(this)} />

        <View style={styles.sideMenuContainer} pointerEvents="box-none">
          <Interactable.View
            ref="menuInstance"
            horizontalOnly={true}
            snapPoints={[{ x: Screen.width }, { x: RemainingWidth }]}
            boundaries={{ right: 3000 }}
            initialPosition={{ x: Screen.width }}
          >

            <View style={styles.sideMenu}>
              <Text style={[baseStyles.title, baseStyles.titleMenu]}>Menu</Text>
              <TouchableOpacity
                style={[baseStyles.navLink]}
                onPress={this._onPressButton}
              >
                <Text>Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[baseStyles.navLink]}
                onPress={this._onPressButton}
              >
                <Text>My Observations</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[baseStyles.navLink]}
                onPress={this._onPressButton}
              >
                <Text>Surveys</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[baseStyles.navLink]}
                onPress={this._onPressButton}
              >
                <Text>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[baseStyles.navLink]}
                onPress={this._onPressButton}
              >
                <Text>About</Text>
              </TouchableOpacity>
              <Button title="Close" onPress={this.onClosePress.bind(this)} />
            </View>
          </Interactable.View>
        </View>

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
          onPress={this._onPressButton}
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
