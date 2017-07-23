import React, { Component } from "react";
import { Image, View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Link } from "react-router-native";

import { initializeObservation } from "../../actions";
import { Text, Wrapper, Map } from "../../components";
import { getFieldType } from "../../components/fields";
import {
  selectActiveObservation,
  selectFeatureType,
  selectIcon
} from "../../selectors";
import { baseStyles } from "../../styles";

class AddObservationScreen extends Component {
  componentDidMount() {
    const {
      initializeObservation,
      observation: { tags: observationTags },
      type: { tags }
    } = this.props;

    const observationKeys = Object.keys(observationTags);
    const typeKeys = Object.keys(tags);
    const shared = observationKeys.filter(x => typeKeys.includes(x));

    if (
      shared.length === 0 ||
      !shared.some(k => [observationKeys[k], "*"].includes(typeKeys[k]))
    ) {
      // initialize a new observation if the type has changed (no shared keys, or if keys are shared, no matches (including wildcards))
      initializeObservation(tags);
    }
  }

  renderField(field, index) {
    const { observation, survey, type: { id } } = this.props;

    try {
      const Field = getFieldType(field.type);

      return (
        <Link key={index} to={`/add-observation/${survey}/${id}/fields`}>
          <Field field={field} observation={observation} />
        </Link>
      );
    } catch (err) {
      console.warn(err);

      return null;
    }
  }

  render() {
    const {
      icon,
      history,
      observation: { tags },
      surveyId,
      type: { fields, name }
    } = this.props;

    const headerView = (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center"
        }}
      >
        <TouchableOpacity onPress={history.goBack}>
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
      <Wrapper headerView={headerView}>
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
              {name} ({surveyId})
            </Text>
            {icon &&
              <Image
                source={{ uri: icon.src }}
                style={{
                  width: 100,
                  height: 50,
                  resizeMode: Image.resizeMode.contain
                }}
              />}
          </View>
        </View>
        <View style={[baseStyles.mapLg]}>
          <Map />

          <View style={[baseStyles.mapEditorBlock]}>
            <Link to="/add-observation/location">
              <Text style={[baseStyles.link]}>+ ADD LOCATION</Text>
            </Link>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <View style={[baseStyles.wrapperContent]}>
            <Text style={[baseStyles.h3]}>Basic Info</Text>

            <View style={baseStyles.fieldset}>
              {fields.map(this.renderField, this)}
            </View>

            <Text>
              {Object.keys(tags).reduce(
                (str, k) => (str += `\n${k}=${tags[k]}`),
                ""
              )}
            </Text>
          </View>
        </View>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { match: { params: { surveyId, type } } } = ownProps;

  const featureType = selectFeatureType(type, state);

  return {
    icon: selectIcon(featureType.icon, state),
    observation: selectActiveObservation(state),
    surveyId,
    type: featureType
  };
};

export default connect(mapStateToProps, { initializeObservation })(
  AddObservationScreen
);
