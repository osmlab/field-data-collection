import React, { Component } from "react";
import { Picker, Switch, TextInput, View } from "react-native";
import DatePicker from "react-native-datepicker";

import { Text } from ".";
import { baseStyles } from "../styles";

class Field extends Component {
  onValueChange = value => {
    const { field: { key }, updateObservation } = this.props;

    updateObservation({
      tags: {
        [key]: value
      }
    });

    this.setState({
      value: value
    });
  };

  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }
}

export class CheckField extends Field {
  render() {
    const { field: { key, label }, observation } = this.props;
    const { tags } = observation;

    const value = tags[key] != null && tags[key] !== "no";

    return (
      <View ref={x => (this._root = x)} style={[baseStyles.field]}>
        <View>
          <Text style={[baseStyles.fieldLabel]}>
            {label}
          </Text>
          <Switch onValueChange={this.onValueChange} value={this.state.value} />
        </View>
      </View>
    );
  }
}

export class PickerField extends Field {
  getPickerItems = () => {
    const { field: { strings: { options } } } = this.props;

    if (Array.isArray(options)) {
      return options.map((opt, idx) =>
        <Picker.Item key={idx} label={opt} value={opt} />
      );
    }

    return Object.keys(options).map((k, idx) =>
      <Picker.Item key={idx} label={options[k]} value={k} />
    );
  };

  render() {
    const { field: { key, label }, observation: { tags } } = this.props;
    const value = tags[key];

    return (
      <View ref={x => (this._root = x)} style={[baseStyles.field]}>
        <View style={{ flex: 1 }}>
          <Text style={[baseStyles.fieldLabel]}>
            {label} ({key})
          </Text>

          <Picker
            onValueChange={this.onValueChange}
            prompt={label}
            selectedValue={value}
            style={{
              flex: 1
            }}
          >
            <Picker.Item label="" value={value} />
            {this.getPickerItems()}
          </Picker>
        </View>
      </View>
    );
  }
}

export class ComboField extends Field {
  render() {
    const { field: { strings } } = this.props;

    if (strings && strings.options) {
      return <PickerField {...this.props} />;
    }

    return <TextField {...this.props} />;
  }
}

export class NumberField extends Field {
  render() {
    const {
      field: { key, label, placeholder },
      focusNextField,
      observation: { tags }
    } = this.props;
    const value = tags[key];

    return (
      <View ref={x => (this._root = x)} style={baseStyles.field}>
        <View style={{ flex: 1 }}>
          <Text style={[baseStyles.fieldLabel]}>
            {label} ({key})
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
  render() {
    const {
      field: { key, label, placeholder },
      focusNextField,
      observation: { tags }
    } = this.props;
    const value = tags[key];

    return (
      <View ref={x => (this._root = x)} style={[baseStyles.field]}>
        <View style={{ flex: 1 }}>
          <Text style={baseStyles.fieldLabel}>
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

export class DateField extends Field {
  componentWillMount() {
    this.state = { value: new Date() };
    this.onValueChange(this.state.value);
  }

  render() {
    const {
      field: { key, label, placeholder },
      focusNextField,
      observation: { tags }
    } = this.props;

    return (
      <View ref={x => (this._root = x)} style={[baseStyles.field]}>
        <View style={{ flex: 1 }}>
          <Text style={baseStyles.fieldLabel}>
            {label}
          </Text>
          <DatePicker
            style={{ width: 200 }}
            date={this.state.value}
            mode="date"
            placeholder="select date"
            format="YYYY-MM-DD"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: "absolute",
                left: 0,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginLeft: 36
              }
            }}
            onDateChange={date => {
              this.onValueChange(date);
            }}
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

    case "localized":
      return TextField;

    case "number":
      return NumberField;

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
