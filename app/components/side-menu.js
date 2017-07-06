import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Button
} from "react-native";
import Interactable from "react-native-interactable";
import { NavigationActions } from "react-navigation";

import { Text } from "./index";
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
    zIndex: 1005,
    borderLeftWidth: 0.5
  },
  sideMenu: {
    left: 0,
    width: SideMenuWidth,
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    elevation: 10
  }
});

class SideMenu extends Component {
  open = () => {
    this._menu.setVelocity({ x: -2000 });
  };

  close = () => {
    this._menu.setVelocity({ x: 3000 });
  };

  render() {
    const { dispatch, navigate } = this.props.navigation;
    const onSync = this.props.onSync;

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
              style={[baseStyles.navLink]}
              onPress={() => {
                const action = NavigationActions.navigate({
                  routeName: "AddProfile"
                });

                navigate("AddProfile");
              }}
            >
              <Text>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[baseStyles.navLink]}
              onPress={() => {
                navigate("MyObservations");
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
