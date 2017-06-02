import React, { Component } from "react";
import { StyleSheet, View } from "react-native";

import { Text } from ".";

const styles = StyleSheet.create({
  field: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "white",
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  fieldLabel: {
    fontSize: 10
  },
  fieldValue: {
    color: "#aaa"
  },
  fieldArrow: {}
});

class Field extends Component {
  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }
}

export class ComboField extends Field {
  render() {
    const { label } = this.props;

    return (
      <View ref={x => (this._root = x)} style={styles.field}>
        <View>
          <Text style={styles.fieldLabel}>{label}</Text>
          <Text style={styles.fieldValue}>(options)</Text>
        </View>
        <View style={styles.fieldArrow}>
          <Text>＞</Text>
        </View>
      </View>
    );
  }
}

export class NumberField extends Field {
  render() {
    const { label, placeholder } = this.props;

    return (
      <View ref={x => (this._root = x)} style={styles.field}>
        <View>
          <Text style={styles.fieldLabel}>{label}</Text>
          <Text style={styles.fieldValue}>{placeholder}</Text>
        </View>
        <View style={styles.fieldArrow}>
          <Text>＞</Text>
        </View>
      </View>
    );
  }
}

export class TextField extends Field {
  render() {
    const { label } = this.props;

    return (
      <View ref={x => (this._root = x)} style={styles.field}>
        <View>
          <Text style={styles.fieldLabel}>{label}</Text>
          <Text style={styles.fieldValue}>(text)</Text>
        </View>
        <View style={styles.fieldArrow}>
          <Text>＞</Text>
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
