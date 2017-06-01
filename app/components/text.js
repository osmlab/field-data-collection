import React, { Component } from "react";
import { Text as BaseText, StyleSheet } from "react-native";

import { baseText } from "../styles";

/*
* Wrapper around base <Text> view from react-native to have base styles inherited
* Source: https://facebook.github.io/react-native/docs/text.html#limited-style-inheritance
*/

class Text extends Component {
  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }

  render() {
    const setRef = component => {
      this._root = component;
    };

    return (
      <BaseText
        {...this.props}
        ref={setRef}
        style={[styles.baseText, this.props.style]}
      >
        {this.props.children}
      </BaseText>
    );
  }
}

const styles = StyleSheet.create({
  baseText: baseText
});

export default Text;
