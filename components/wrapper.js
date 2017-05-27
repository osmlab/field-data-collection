import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import { baseStyles } from '../styles';

/*
* A way to set a background color without getting into android/ios files
*/

class Wrapper extends Component {
  constructor (props) {
    super(props);
  }

  setNativeProps (nativeProps) {
    this._root.setNativeProps(nativeProps);
  }

  render () {
    const setRef = (component) => {
      this._root = component
    }

    return (
      <View ref={setRef} style={[baseStyles.wrapper, this.props.style]} onPress={() => {
        console.log('wututuututututututut')
      }}>
        {this.props.children}
      </View>
    );
  }
}

export default Wrapper;
