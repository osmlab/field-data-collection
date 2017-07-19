import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Button
} from "react-native";
import Interactable from "react-native-interactable";
import { Link } from "react-router-native";

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
    console.log("weeeoooooooooooooo");
    this._menu.setVelocity({ x: 3000 });
  };

  render() {
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

            <Link to="/account/profile" style={baseStyles.navLink}>
              <Text>Profile</Text>
            </Link>

            <Link to="/account/observations" style={[baseStyles.navLink]}>
              <Text>My Observations</Text>
            </Link>

            <Link to="/account/surveys" style={[baseStyles.navLink]}>
              <Text>Surveys</Text>
            </Link>

            <Link to="/account/settings" style={[baseStyles.navLink]}>
              <Text>Settings</Text>
            </Link>

            <Link to="/account/about" style={[baseStyles.navLink]}>
              <Text>About</Text>
            </Link>

            <Button title="Close" onPress={this.close} />
          </View>
        </Interactable.View>
      </View>
    );
  }
}

export default SideMenu;
