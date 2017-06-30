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
import Icon from "react-native-vector-icons/MaterialIcons";

import { Text, Wrapper } from "../../components";
import { getFieldType } from "../../components/fields";
import { selectFeatureType } from "../../selectors";
import { baseStyles } from "../../styles";

const styles = StyleSheet.create({});

class AddObservationScreen extends Component {
  onBackPress = () => this.props.navigation.dispatch(NavigationActions.back());

  renderField(field, index) {
    const { navigate } = this.props.navigation;
    const { state: { params: { category } } } = this.props.navigation;
    const { name, fields } = category;

    try {
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
    } catch (err) {
      console.warn(err);

      return null;
    }
  }

  addLocation() {
    const { navigate } = this.props.navigation;
    navigate("Location");
  }

  render() {
    const { state: { params: { category } } } = this.props.navigation;
    const { name, fields } = category;

    const headerView = (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center"
        }}
      >
        <TouchableOpacity onPress={this.onBackPress}>
          <Icon
            name="keyboard-backspace"
            style={[[baseStyles.headerBackIcon]]}
          />
        </TouchableOpacity>
        <Text style={[baseStyles.h3, baseStyles.headerTitle]}>
          Add Observation
        </Text>
      </View>
    );

    return (
      <Wrapper navigation={this.props.navigation} headerView={headerView}>
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
  const { navigation: { state: { params: { observationType } } } } = ownProps;

  return {
    type: selectFeatureType(observationType, state)
  };
};

export default connect(mapStateToProps)(AddObservationScreen);
