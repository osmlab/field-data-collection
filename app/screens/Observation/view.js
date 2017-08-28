import React, { Component } from "react";
import { Image, View, TouchableOpacity, ScrollView } from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Link } from "react-router-native";

import { saveObservation, updateObservation } from "../../actions";
import { Text, Wrapper, Map, LocationModal } from "../../components";
import { getFieldType } from "../../components/fields";
import {
  selectActiveObservation,
  selectFeatureType,
  selectIcon
} from "../../selectors";
import { baseStyles } from "../../styles";

class ViewObservationScreen extends Component {
  state = {
    modalOpen: false
  };

  closeModal = () =>
    this.setState({
      modalOpen: false
    });

  openModal = () =>
    this.setState({
      modalOpen: true
    });

  renderField(field, index) {
    const { observation, surveyId, type: { id } } = this.props;

    try {
      const Field = getFieldType(field.type);

      return (
        <Link key={index} to={`/observation/${surveyId}/${id}/fields`}>
          <Field field={field} observation={observation} />
        </Link>
      );
    } catch (err) {
      console.warn(err);

      return null;
    }
  }

  save = () => {
    const {
      saveObservation,
      history,
      observation,
      surveyId,
      type
    } = this.props;

    observation.survey = { id: surveyId, type: type.id };
    saveObservation(observation);
    history.push("/");
  };

  onUpdateLocation = coordinates => {
    updateObservation(coordinates);
  };

  renderMap = () => {
    const { observation } = this.props;

    const locationText =
      observation.lat && observation.on ? "EDIT LOCATION" : "ADD LOCATION";

    return (
      <View style={[baseStyles.mapLg]}>
        <Map height={250} zoom={14} />

        <View style={[baseStyles.mapEditorBlock]}>
          <TouchableOpacity onPress={this.openModal}>
            <Text style={[baseStyles.link]}>
              + {locationText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    const {
      icon,
      history,
      observation,
      surveyId,
      type: { fields, name },
      observation: { tags }
    } = this.props;

    const { modalOpen } = this.state;

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
        {modalOpen && <LocationModal close={this.closeModal} />}

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

        {this.renderMap()}

        <View style={{ marginTop: 20 }}>
          <View style={[baseStyles.wrapperContent]}>
            <Text style={[baseStyles.h3]}>Basic Info</Text>

            <View style={[baseStyles.fieldset, { marginBottom: 50 }]}>
              {fields.map(this.renderField, this)}
            </View>

            <TouchableOpacity
              onPress={this.save}
              style={baseStyles.buttonBottom}
            >
              <Text style={baseStyles.textWhite}>SAVE</Text>
            </TouchableOpacity>
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

export default connect(mapStateToProps, {
  saveObservation,
  updateObservation
})(ViewObservationScreen);