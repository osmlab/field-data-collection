import React, { Component } from "react";
import { View } from "react-native";

import { Text } from ".";
import { baseStyles } from "../styles";
import Icon from "react-native-vector-icons/MaterialIcons";
import { format } from "date-fns";

class Field extends Component {
  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }
}

export class CheckField extends Field {
  render() {
    const { field: { key, label }, observation: { tags } } = this.props;
    const value = tags[key];

    return (
      <View ref={x => (this._root = x)} style={[baseStyles.field]}>
        <View style={[baseStyles.wrappedItemsLg]}>
          <Text style={[baseStyles.h5]}>
            {label.toUpperCase()}
          </Text>
          <Text style={[baseStyles.fieldValue]}>
            {value}
          </Text>
        </View>
        <View style={[baseStyles.wrappedItemsSm]}>
          <Icon
            name="keyboard-arrow-right"
            style={[[baseStyles.formArrowCategories]]}
          />
        </View>
      </View>
    );
  }
}

export class ComboField extends Field {
  render() {
    const {
      field: { default: placeholder, key, label, strings },
      observation: { tags }
    } = this.props;

    let value = tags[key];

    if (strings && strings.options && !Array.isArray(strings.options)) {
      value = strings.options[tags[key]];
    }

    return (
      <View ref={x => (this._root = x)} style={[baseStyles.field]}>
        <View style={[baseStyles.wrappedItemsLg]}>
          <Text style={[baseStyles.h5]}>
            {label.toUpperCase()}
          </Text>
          <Text style={[baseStyles.fieldValue]}>
            {value || placeholder}
          </Text>
        </View>
        <View style={[baseStyles.wrappedItemsSm]}>
          <Icon
            name="keyboard-arrow-right"
            style={[[baseStyles.formArrowCategories]]}
          />
        </View>
      </View>
    );
  }
}

export class NumberField extends Field {
  render() {
    const {
      field: { key, label, placeholder },
      observation: { tags }
    } = this.props;
    const value = tags[key];

    return (
      <View ref={x => (this._root = x)} style={[baseStyles.field]}>
        <View style={[baseStyles.wrappedItemsLg]}>
          <Text style={[baseStyles.h5]}>
            {label.toUpperCase()}
          </Text>
          <Text style={[baseStyles.fieldValue]}>
            {/* TODO grey out placeholder if used */}
            {value || placeholder}
          </Text>
        </View>
        <View style={[baseStyles.wrappedItemsSm]}>
          <Icon
            name="keyboard-arrow-right"
            style={[[baseStyles.formArrowCategories]]}
          />
        </View>
      </View>
    );
  }
}

export class TextField extends Field {
  render() {
    const {
      field: { key, label, placeholder },
      observation: { tags }
    } = this.props;
    const value = tags[key];

    return (
      <View ref={x => (this._root = x)} style={[baseStyles.field]}>
        <View style={[baseStyles.wrappedItemsLg]}>
          <Text style={[baseStyles.h5]}>
            {label.toUpperCase()}
          </Text>
          <Text style={[baseStyles.fieldValue]}>
            {/* TODO grey out placeholder if used */}
            {value || placeholder}
          </Text>
        </View>
        <View style={[baseStyles.wrappedItemsSm]}>
          <Icon
            name="keyboard-arrow-right"
            style={baseStyles.formArrowCategories}
          />
        </View>
      </View>
    );
  }
}

export class DateField extends Field {
  render() {
    const {
      field: { key, label, placeholder },
      observation: { tags }
    } = this.props;
    const value = tags[key]
      ? format(tags[key] || placeholder, "h:mm aa ddd, MMM D, YYYY")
      : null;

    return (
      <View ref={x => (this._root = x)} style={[baseStyles.field]}>
        <View style={[baseStyles.wrappedItemsLg]}>
          <Text style={[baseStyles.h5]}>
            {label.toUpperCase()}
          </Text>
          <Text style={[baseStyles.fieldValue]}>
            {/* TODO grey out placeholder if used */}
            {value}
          </Text>
        </View>
        <View style={[baseStyles.wrappedItemsSm]}>
          <Icon
            name="keyboard-arrow-right"
            style={baseStyles.formArrowCategories}
          />
        </View>
      </View>
    );
  }
}

export const getFieldType = type => {
  switch (type) {
    case "check":
      return CheckField;

    case "combo":
      return ComboField;

    case "number":
      return NumberField;

    case "localized":
      return TextField;

    case "text":
      return TextField;

    case "textarea":
      return TextField;

    case "date":
      return DateField;

    default:
      throw new Error(`Unsupported field type: ${type}`);
  }
};
