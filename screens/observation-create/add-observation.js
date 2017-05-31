import React, { Component } from "react";
import { StyleSheet, View, TouchableHighlight } from "react-native";
import { NavigationActions } from "react-navigation";

import { Text, Wrapper } from "../../components";
import { getFieldType } from "../../components/fields";
import { baseStyles } from "../../styles";
import survey from "../../config/survey.json";

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5
  },
  fieldset: {
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#ccc"
  }
});

class AddObservationScreen extends Component {
  componentWillMount() {
    console.log("props:", this.props);
    const {
      navigation: { state: { params: { observationType } } }
    } = this.props;

    const type = survey.featureTypes.find(x => x.id === observationType);

    console.log("type:", type);

    this.setState({
      type
    });
  }

  onBackPress = () => this.props.navigation.dispatch(NavigationActions.back());

  renderField(field, key) {
    const { navigate } = this.props.navigation;

    const Field = getFieldType(field.type);

    return (
      <TouchableHighlight
        key={key}
        onPress={() =>
          navigate("FieldsetForm", { fieldset: { title: "Basic info" } })}
      >
        <Field {...field} />
      </TouchableHighlight>
    );
  }

  render() {
    const { type: { fields, name } } = this.state;

    return (
      <Wrapper>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <Text
            style={{ fontSize: 30, marginTop: -10, marginRight: 5 }}
            onPress={this.onBackPress}
          >
            ←
          </Text>
          <Text style={[baseStyles.title]}>Adding: {name}</Text>
        </View>

        <View
          style={{
            marginTop: 20,
            marginBottom: 20,
            flexDirection: "row",
            flexWrap: "wrap"
          }}
        >
          <Text>
            <Text style={{}}>Adding point to: </Text>
            <Text style={{ paddingLeft: 5, paddingRight: 5 }}>Survey 1 </Text>
            <Text
              style={{
                textDecorationLine: "underline",
                textDecorationStyle: "solid",
                textDecorationColor: "#ccc"
              }}
            >
              edit
            </Text>
          </Text>
        </View>

        {/* TODO: map */}
        <View
          style={{
            height: 200,
            backgroundColor: "white",
            justifyContent: "flex-end"
          }}
        >
          <Text style={[styles.sectionTitle, { padding: 20 }]}>
            Add Location
          </Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={[styles.sectionTitle]}>Basic info</Text>

          <View style={styles.fieldset}>
            {fields.map(this.renderField, this)}
          </View>
        </View>
      </Wrapper>
    );
  }
}

export default AddObservationScreen;
