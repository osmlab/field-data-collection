import React, { Component } from "react";
import { ScrollView } from "react-native";

import { baseStyles } from "../styles";

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
      <ScrollView
        {...this.props}
        ref={setRef}
        style={[baseStyles.wrapper, this.props.style]}
      >
        {this.props.children}
      </ScrollView>
    );
  }
}

export default Wrapper;
