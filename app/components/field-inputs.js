import React, { Component } from "react";
import { Picker, Switch, TextInput, View } from "react-native";

import { Text } from ".";
import { baseStyles } from "../styles";

class Field extends Component {
  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }
}

export class CheckField extends Field {
  state = {
    value: false
  };

  onValueChange = value =>
    this.setState({
      value
    });

  render() {
    const { label } = this.props;
    const { value } = this.state;

    return (
      <View ref={x => (this._root = x)} style={[baseStyles.field]}>
        <View>
          <Text style={[baseStyles.fieldLabel]}>
            {label}
          </Text>
          <Switch onValueChange={this.onValueChange} value={value} />
        </View>
      </View>
    );
  }
}

export class PickerField extends Field {
  state = {
    value: null
  };

  getPickerItems = () => {
    const { strings: { options } } = this.props;

    if (Array.isArray(options)) {
      return options.map((opt, idx) =>
        <Picker.Item key={idx} label={opt} value={opt} />
      );
    }

    return Object.keys(options).map((k, idx) =>
      <Picker.Item key={idx} label={options[k]} value={k} />
    );
  };

  onValueChange = value => this.setState({ value });

  render() {
    const { label } = this.props;
    const { value } = this.state;

    return (
      <View ref={x => (this._root = x)} style={[baseStyles.field]}>
        <View style={{ flex: 1 }}>
          <Text style={[baseStyles.fieldLabel]}>
            {label}
          </Text>
          <Picker
            onValueChange={this.onValueChange}
            prompt={label}
            selectedValue={value}
            style={{
              flex: 1
            }}
          >
            <Picker.Item label="" value={null} />
            {this.getPickerItems()}
          </Picker>
        </View>
      </View>
    );
  }
}

export class ComboField extends Field {
  render() {
    const { strings } = this.props;

    if (strings != null && strings.options != null) {
      return <PickerField {...this.props} />;
    }

    return <TextField {...this.props} />;
  }
}

export class NumberField extends Field {
  state = {
    value: null
  };

  onValueChange = value =>
    this.setState({
      value
    });

  render() {
    const { focusNextField, label, placeholder } = this.props;
    const { value } = this.state;

    return (
      <View ref={x => (this._root = x)} style={baseStyles.field}>
        <View style={{ flex: 1 }}>
          <Text style={[baseStyles.fieldLabel]}>
            {label}
          </Text>
          <TextInput
            onChangeText={this.onValueChange}
            keyboardType="numeric"
            onSubmitEditing={focusNextField}
            placeholder={placeholder}
            style={[baseStyles.fieldValue, { flex: 1 }]}
            underlineColorAndroid="transparent"
            value={value}
          />
        </View>
      </View>
    );
  }
}

export class TextField extends Field {
  state = {
    value: null
  };

  onValueChange = value =>
    this.setState({
      value
    });

  render() {
    const { focusNextField, label, placeholder } = this.props;
    const { value } = this.state;

    return (
      <View ref={x => (this._root = x)} style={[baseStyles.field]}>
        <View style={{ flex: 1 }}>
          <Text style={baseStyles.h5}>
            {label}
          </Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={this.onValueChange}
            onSubmitEditing={focusNextField}
            style={[baseStyles.fieldValue, { flex: 1 }]}
            placeholder={placeholder}
            underlineColorAndroid="transparent"
            value={value}
          />
        </View>
      </View>
    );
  }
}

export const getFieldInput = type => {
  switch (type) {
    case "check":
      return CheckField;

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
