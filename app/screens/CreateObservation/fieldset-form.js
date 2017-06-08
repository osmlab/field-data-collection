import React, { Component } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { NavigationActions } from "react-navigation";

import { Text, Wrapper, getFieldInput } from "../../components";
import { baseStyles } from "../../styles";

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5
  },
  fieldset: {}
});

class FieldsetFormScreen extends Component {
  componentWillMount() {
    const { navigation: { state: { params: { fieldset } } } } = this.props;

    this.setState({
      fieldset
    });
  }

  renderField(field, index) {
    const { navigate } = this.props.navigation;
    const { fields } = this.props;
    const Field = getFieldInput(field.type);
    return <Field {...field} />;
  }

  onClosePress = () => this.props.navigation.dispatch(NavigationActions.back());

  render() {
    console.log("render this.props", this.props);
    console.log("render this.state", this.state);
    const { fieldset } = this.state;
    const fields = fieldset.fields;
    let input;

    return (
      <Wrapper>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Text style={baseStyles.title}>
            {fieldset.title}
          </Text>
          <Text style={{ fontSize: 25 }} onPress={this.onClosePress}>
            ⅹ
          </Text>
        </View>

        <View style={{}}>
          <TextInput
            ref={c => (input = c)}
            style={{
              backgroundColor: "white",
              borderColor: "#ccc",
              borderWidth: 1,
              padding: 6,
              paddingLeft: 10,
              borderRadius: 2,
              marginTop: 5,
              height: 35
            }}
            placeholder="placeholder"
            placeholderTextColor="#ccc"
            underlineColorAndroid="transparent"
            onSubmitEditing={() => input.blur()}
            onChangeText={val => console.log("field value", val)}
          />
        </View>
        <View style={styles.fieldset}>
          {fields.map(this.renderField, this)}
        </View>
      </Wrapper>
    );
  }
}

export default FieldsetFormScreen;
