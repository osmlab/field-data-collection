import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableHighlight,
  TouchableOpacity
} from "react-native";
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Text, Wrapper, PercentComplete, Map } from "../../components";
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

  addLocation = () => {
    const { navigate } = this.props.navigation;
    navigate("Location");
  };

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
            baseStyles.wrapperContentHeader,
            baseStyles.headerPage,
            { flexWrap: "wrap", flex: 1, flexDirection: "row" }
          ]}
        >
          <View style={[baseStyles.headerPageText]}>
            <Text
              style={[
                baseStyles.h2,
                baseStyles.textWhite,
                baseStyles.headerWithDescription
              ]}
            >
              {name}
            </Text>
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
        <View style={[baseStyles.mapLg]}>
          <Map />

          <View style={[baseStyles.mapEditorBlock]}>
            <TouchableOpacity onPress={this.addLocation}>
              <Text style={[baseStyles.link]}>+ ADD LOCATION</Text>
            </TouchableOpacity>
          </View>
        </View>
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
