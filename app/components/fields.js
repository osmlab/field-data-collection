import React, { Component } from "react";
import { View } from "react-native";

import { Text } from ".";
import { baseStyles } from "../styles";
import Icon from "react-native-vector-icons/MaterialIcons";

class Field extends Component {
  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }
}

export class ComboField extends Field {
  render() {
    const { label } = this.props;

    return (
      <View ref={x => (this._root = x)} style={[baseStyles.field]}>
        <View>
          <Text style={[baseStyles.h5]}>
            {label.toUpperCase()}
          </Text>
          <Text style={[baseStyles.fieldValue]}>(options)</Text>
        </View>
        <View>
          <Icon name="keyboard-arrow-right" style={[[baseStyles.formArrow]]} />
        </View>
      </View>
    );
  }
}

export class NumberField extends Field {
  render() {
    const { label, placeholder } = this.props;

    return (
      <View ref={x => (this._root = x)} style={[baseStyles.field]}>
        <View>
          <Text style={[baseStyles.h5]}>
            {label.toUpperCase()}
          </Text>
          <Text style={[baseStyles.fieldValue]}>
            {placeholder}
          </Text>
        </View>
        <View>
          <Icon name="keyboard-arrow-right" style={[[baseStyles.formArrow]]} />
        </View>
      </View>
    );
  }
}

export class TextField extends Field {
  render() {
    const { label } = this.props;

    return (
      <View ref={x => (this._root = x)} style={[baseStyles.field]}>
        <View>
          <Text style={[baseStyles.h5]}>
            {label.toUpperCase()}
          </Text>
          <Text style={[baseStyles.fieldValue]}>(text)</Text>
        </View>
        <View>
          <Icon name="chevron_right" style={baseStyles.fieldArrow} />
        </View>
      </View>
    );
  }
}

export const getFieldType = type => {
  switch (type) {
    case "combo":
      return ComboField;

    case "number":
      return NumberField;

    case "text":
      return TextField;

    default:
      throw new Error(`Unsupported field type: ${type}`);
  }
};
