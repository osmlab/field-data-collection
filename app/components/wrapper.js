import React, { Component } from "react";
import { ScrollView, View } from "react-native";

import { baseStyles } from "../styles";
import Header from "./header";
import SideMenu from "./side-menu";
/*
* A way to set a background color without getting into android/ios files
*/

class Wrapper extends Component {
  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }

  render() {
    const setRef = component => {
      this._root = component;
    };

    return (
      <View>
        <Header />

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
