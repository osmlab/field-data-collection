import React, { Component } from "react";
import { StyleSheet, View, TextInput } from "react-native";

import { Text } from ".";
import { baseStyles } from "../styles";

const styles = StyleSheet.create({});

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
          <Text style={[baseStyles.fieldLabel]}>{label}</Text>
          <Text style={styles.fieldValue}>(options)</Text>
        </View>
      </View>
    );
  }
}

export class NumberField extends Field {
  render() {
    const { label, placeholder } = this.props;

    return (
      <View ref={x => (this._root = x)} style={baseStyles.field}>
        <View>
          <Text style={styles.fieldLabel}>{label}</Text>
          <TextInput
            style={styles.fieldValue}
            value={placeholder}
            keyboardType="numeric"
          />
        </View>
      </View>
    );
  }
}

export class TextField extends Field {
  render() {
    const { label, placeholder } = this.props;

    return (
      <View ref={x => (this._root = x)} style={baseStyles.field}>
        <View>
          <Text style={baseStyles.h5}>{label}</Text>
          <TextInput style={styles.fieldValue} value={placeholder} />
        </View>
      </View>
    );
  }
}

export const getFieldInput = type => {
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
