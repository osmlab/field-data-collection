import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableHighlight,
  TouchableOpacity
} from "react-native";
import Mapbox, { MapView } from "react-native-mapbox-gl";
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";

import { Text, Wrapper } from "../../components";
import { getFieldType } from "../../components/fields";
import { baseStyles } from "../../styles";

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
  onBackPress = () => this.props.navigation.dispatch(NavigationActions.back());

  renderField(field, index) {
    const { navigate } = this.props.navigation;
    const { type: { fields, name } } = this.props;

    const Field = getFieldType(field.type);

    return (
      <TouchableHighlight
        key={index}
        onPress={() =>
          navigate("FieldsetForm", {
            fieldset: { title: name, index, fields }
          })}
      >
        <Field {...field} />
      </TouchableHighlight>
    );
  }

  addLocation() {
    const { navigate } = this.props.navigation;
    navigate("Location");
  }

  render() {
    const { type: { fields, name } } = this.props;

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

        <TouchableOpacity onPress={this.addLocation.bind(this)}>
          <Text style={[styles.sectionTitle, { padding: 20, zIndex: 6000 }]}>
            Add Location
          </Text>
        </TouchableOpacity>

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

const mapStateToProps = (state, ownProps) => {
  const survey = state.surveys[0];

  const { navigation: { state: { params: { observationType } } } } = ownProps;

  const type = survey.featureTypes.find(x => x.id === observationType);

  return {
    type
  };
};

export default connect(mapStateToProps)(AddObservationScreen);
