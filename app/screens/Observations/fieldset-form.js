import React, { Component } from "react";
import { View, TextInput } from "react-native";

import { Text, Wrapper, getFieldInput } from "../../components";
import { baseStyles } from "../../styles";

class FieldsetFormScreen extends Component {
  componentWillMount() {
    this.setState({
      fieldset: {} // TODO get fieldset from props
    });
  }

  renderField(field, index) {
    const Field = getFieldInput(field.type);
    return <Field {...field} />;
  }

  render() {
    const { history } = this.props;
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
          <Text style={[baseStyles.title]}>
            {fieldset.title}
          </Text>
          <Text style={{ fontSize: 25 }} onPress={history.goBack}>
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
        <View style={[baseStyles.fieldset]}>
          {fields.map(this.renderField, this)}
        </View>
      </Wrapper>
    );
  }
}

export default FieldsetFormScreen;
