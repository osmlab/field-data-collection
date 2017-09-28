import React, { Component } from "react";
import { ScrollView, View } from "react-native";

import { baseStyles } from "../styles";
import Header from "./header";
import SideMenu from "./side-menu";
import Text from "./text";
import StatusBar from "./StatusBar";

/*
* A way to set a background color without getting into android/ios files
*/

class Wrapper extends Component {
  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }

  onMenuPress = () => {
    this._menu.open();
  };

  render() {
    const setRef = component => {
      this._root = component;
    };

    const headerView = this.props.headerView || <Text>Observe</Text>;
    const hideStatusBar = this.props.hideStatusBar;

    return (
      <View style={baseStyles.wrapper}>
        <Header onTogglePress={this.onMenuPress}>
          {headerView}
        </Header>

        <SideMenu
          ref={menu => {
            this._menu = menu;
          }}
        />

        {!hideStatusBar && <StatusBar />}

        <ScrollView
          {...this.props}
          ref={setRef}
          style={[baseStyles.wrapper, this.props.style]}
        >
          {this.props.children}
        </ScrollView>
      </View>
    );
  }
}

export default Wrapper;
