import React, { Component } from "react";
import {
  Image,
  View,
  TouchableHighlight,
  TouchableOpacity
} from "react-native";
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Text, Wrapper, PercentComplete } from "../../components";
import { getFieldType } from "../../components/fields";
import { selectFeatureType, selectIcon } from "../../selectors";
import { baseStyles } from "../../styles";

class AddObservationScreen extends Component {
  onBackPress = () => this.props.navigation.dispatch(NavigationActions.back());

  renderField(field, index) {
    const { navigation: { navigate }, type: { fields, name } } = this.props;

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
    const { icon, type: { fields, name } } = this.props;

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
            <Image
              source={{ uri: icon.src }}
              style={{
                width: 100,
                height: 50,
                resizeMode: Image.resizeMode.contain
              }}
            />
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
          <View style={{ flex: 0.25, position: "relative" }}>
            <PercentComplete radius={50} complete={5} incomplete={4}>
              <Text
                style={[
                  baseStyles.percentCompleteText,
                  baseStyles.textWhite,
                  { position: "absolute", marginTop: 5, paddingLeft: 5 }
                ]}
              >
                <Text
                  style={[
                    baseStyles.percentCompleteTextNum,
                    baseStyles.textWhite
                  ]}
                >
                  80%
                </Text>{" "}
                Complete
              </Text>
            </PercentComplete>
          </View>
        </View>
        <View style={[baseStyles.mapLg]}>
          <Text>Map</Text>
          <View style={[baseStyles.mapEditorBlock]}>
            <TouchableOpacity onPress={this.addLocation.bind(this)}>
              <Text style={[baseStyles.link]}>
                {"+ Add Location".toUpperCase()}
              </Text>
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
  const { navigation: { state: { params: { type } } } } = ownProps;

  const featureType = selectFeatureType(type, state);

  return {
    icon: selectIcon(featureType.icon, state),
    type: featureType
  };
};

export default connect(mapStateToProps)(AddObservationScreen);
