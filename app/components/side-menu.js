import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Button
} from "react-native";
import Interactable from "react-native-interactable";

import { Text } from "./index";
import osmp2p from "../lib/osm-p2p";
import websocket from "websocket-stream";

import { baseStyles } from "../styles";

const Screen = Dimensions.get("window");
const SideMenuWidth = 280;
const RemainingWidth = Screen.width - SideMenuWidth;

const styles = StyleSheet.create({
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
  }
});

class SideMenu extends Component {
  open = () => {
    console.log("open", this._menu);
    this._menu.setVelocity({ x: -2000 });
  };

  close = () => {
    console.log("close");
    this._menu.setVelocity({ x: 3000 });
  };

  render() {
    console.log("this.props", this.props);

    return (
      <View style={styles.sideMenuContainer} pointerEvents="box-none">
        <Interactable.View
          ref={menu => {
            this._menu = menu;
          }}
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
                var ws = websocket("ws://10.0.2.2:3000");

                this.osm.sync(ws, err => {
                  if (err) console.log(err);
                  this.osm.ready(() => {
                    this.prepareAnnotations();
                  });
                });
              }}
            >
              <Text>Sync Data</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ paddingLeft: 30 }}
              onPress={() => {
                AsyncStorage.clear(function(err) {
                  console.log("data cleared", err);
                });
              }}
            >
              <Text>Delete data</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[baseStyles.navLink]}
              onPress={() => {
                navigate("AddProfile");
              }}
            >
              <Text>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[baseStyles.navLink]}
              onPress={() => {
                navigate("AccountObservations");
              }}
            >
              <Text>My Observations</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[baseStyles.navLink]}
              onPress={() => {
                navigate("Surveys");
              }}
            >
              <Text>Surveys</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[baseStyles.navLink]}
              onPress={() => {
                navigate("Settings");
              }}
            >
              <Text>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[baseStyles.navLink]}
              onPress={() => {
                navigate("About");
              }}
            >
              <Text>About</Text>
            </TouchableOpacity>

            <Button title="Close" onPress={this.close} />
          </View>
        </Interactable.View>
      </View>
    );
  }
}

export default SideMenu;
