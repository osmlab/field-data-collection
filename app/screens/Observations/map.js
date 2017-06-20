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

import Interactable from "react-native-interactable";

import { Header, Text } from "../../components";
import { baseStyles } from "../../styles";
import osmp2p from "../../lib/osm-p2p";
import websocket from "../../lib/websocket";

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
        latitude: 47.6685,
        longitude: -122.384
      },
      zoom: 16,
      userTrackingMode: Mapbox.userTrackingMode.none,
      annotations: []
    });
  }

  onMenuPress() {
    this.refs["menuInstance"].setVelocity({ x: -2000 });
  }

  onClosePress() {
    this.refs["menuInstance"].setVelocity({ x: 3000 });
  }

  getFeatures() {
    this._map.getBounds(data => {
      var q = [[data[0], data[2]], [data[1], data[3]]];
      var annotations = [];
      var stream = this.osm.queryGeoJSONStream(q);

      stream.on("data", d => {
        const type = d.geometry.type.toLowerCase();
        const coordinates = d.geometry.coordinates;

        if (type === "point" && coordinates) {
          annotations.push({
            id: d.id,
            type: type,
            coordinates: coordinates.reverse(),
            annotationImage: {
              source: {
                uri: "https://cldup.com/7NLZklp8zS.png"
              },
              height: 25,
              width: 25
            }
          });
        }
      });

      stream.on("end", () => {
        this.setState({
          annotations
        });
      });
    });
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
                style={{ paddingLeft: 30 }}
                onPress={() => {
                  var ws = websocket();

                  this.osm.sync(ws, err => {
                    if (err) console.log(err);
                    this.osm.ready(() => {
                      this.getFeatures();
                    });
                  });
                }}
              >
                <Text>Sync Data</Text>
              </TouchableOpacity>

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
          annotations={this.state.annotations}
          onFinishLoadingMap={this.getFeatures.bind(this)}
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
      </View>
    );
  }
}

export default ObservationMapScreen;
