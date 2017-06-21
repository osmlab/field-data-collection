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

const styles = StyleSheet.create({});

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
      <Wrapper navigation={this.props.navigation}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <Text style={[baseStyles.headerBackIcon]} onPress={this.onBackPress}>
            ←
          </Text>
          <Text style={[baseStyles.title]}>Add</Text>
        </View>

        <View
          style={[
            baseStyles.headerPage,
            {
              flexDirection: "row",
              flexWrap: "wrap"
            }
          ]}
        >
          <View style={[baseStyles.wrapperContent]}>
            <Text style={[baseStyles.h2, baseStyles.textWhite]}>{name}</Text>
            <Text>
              <Text style={[baseStyles.textWhite]}>Adding point to: </Text>
              <Text
                style={[
                  baseStyles.textWhite,
                  { paddingLeft: 5, paddingRight: 5 }
                ]}
              >
                Survey 1
              </Text>
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={this.addLocation.bind(this)}>
          <Text style={[baseStyles.link, { zIndex: 6000 }]}>
            + Add Location
          </Text>
        </TouchableOpacity>

        <View style={{ marginTop: 20 }}>
          <View style={[baseStyles.wrapperContent]}>
            <Text style={[baseStyles.h3]}>Basic Info</Text>

            <View style={baseStyles.fieldset}>
              {fields.map(this.renderField, this)}
            </View>
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
