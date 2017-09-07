import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Link } from "react-router-native";

import { saveObservation, updateObservation } from "../../actions";
import {
  Text,
  Wrapper,
  Map,
  LocationModal,
  ObservationTypeModal,
  AnnotationObservation
} from "../../components";
import { getFieldType } from "../../components/fields";
import {
  selectActiveObservation,
  selectAllCategories,
  selectFeatureType
} from "../../selectors";
import { baseStyles } from "../../styles";

class ViewObservationScreen extends Component {
  state = {
    locationModalOpen: false,
    openObservationTypeModalOpen: false
  };

  closeLocationModal = () =>
    this.setState({
      locationModalOpen: false
    });

  closeObservationTypeModal = () =>
    this.setState({
      observationTypeModalOpen: false
    });

  openLocationModal = () =>
    this.setState({
      locationModalOpen: true
    });

  openObservationTypeModal = () =>
    this.setState({
      observationTypeModalOpen: true
    });

  onObservationTypeSelected = type => {
    const { observation, updateObservation } = this.props;

    updateObservation({
      ...observation,
      tags: {
        ...observation.tags,
        ...type.tags,
        surveyId: type.surveyId,
        surveyType: type.id
      }
    });

    this.closeObservationTypeModal();
  };

  renderField(field, index) {
    const {
      observation,
      observation: { tags: { surveyId } },
      type: { id }
    } = this.props;

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
    const { saveObservation, history, observation } = this.props;

    saveObservation(observation);
    history.push("/");
  };

  onUpdateLocation = coordinates => {
    this.setState({ coordinates });

    updateObservation({
      lat: coordinates.latitude,
      lon: coordinates.longitude
    });

    this._map.setCenterCoordinate(
      coordinates.latitude,
      coordinates.longitude,
      true
    );
  };

  componentWillMount = () => {
    const { observation } = this.props;

    if (observation != null) {
      this.setState({
        coordinates: {
          latitude: observation.lat,
          longitude: observation.lon
        }
      });
    }
  };

  componentWillUpdate(nextProps, nextState) {
    const { observation } = this.props;
    const { nextObservation } = nextProps;

    if (observation == null && nextObservation != null) {
      // center the newly-active observation
      this.setState({
        coordinates: {
          latitude: observation.lat,
          longitude: observation.lon
        }
      });
    }
  }

  setRef = map => {
    this._map = map;
  };

  renderMap = () => {
    const { observation } = this.props;

    const locationText =
      observation.lat && observation.on ? "EDIT LOCATION" : "ADD LOCATION";

    return (
      <View style={[baseStyles.mapLg]}>
        <Map
          mapref={this.setRef}
          height={250}
          zoom={14}
          center={this.state.coordinates}
        >
          <AnnotationObservation
            id="observation"
            coordinates={this.state.coordinates}
          />
        </Map>

        <View style={[baseStyles.mapEditorBlock]}>
          <TouchableOpacity onPress={this.openLocationModal}>
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
      categories,
      history,
      observation,
      type: { fields, name }
    } = this.props;

    if (observation == null) {
      console.log("waiting for observation to become active...");
      return null;
    }

    const { locationModalOpen, observationTypeModalOpen } = this.state;

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
      <Wrapper style={[baseStyles.wrapper]} headerView={headerView}>
        {locationModalOpen &&
          <LocationModal
            close={this.closeLocationModal}
            onUpdateLocation={this.onUpdateLocation}
          />}

        {observationTypeModalOpen &&
          <ObservationTypeModal
            categories={categories}
            close={this.closeObservationTypeModal}
            onSelect={this.onObservationTypeSelected}
          />}

        <View
          style={[
            baseStyles.wrapperContentHeader,
            baseStyles.headerPage,
            { flexWrap: "wrap", flex: 1, flexDirection: "row" }
          ]}
        >
          <View style={[baseStyles.headerPageText]}>
            {fields != null &&
              <Text
                style={[
                  baseStyles.h2,
                  baseStyles.textWhite,
                  baseStyles.headerWithDescription
                ]}
              >
                {name}
              </Text>}
            {fields == null &&
              <TouchableOpacity onPress={this.openObservationTypeModal}>
                <Text
                  style={[
                    baseStyles.h2,
                    baseStyles.textWhite,
                    baseStyles.headerWithDescription
                  ]}
                >
                  Select observation type
                </Text>
              </TouchableOpacity>}
          </View>
        </View>

        {this.renderMap()}

        <View style={{ marginTop: 20 }}>
          <View style={[baseStyles.wrapperContent]}>
            {fields != null &&
              <View>
                <Text style={[baseStyles.h3]}>Basic Info</Text>

                <View style={[baseStyles.fieldset, { marginBottom: 50 }]}>
                  {fields.map(this.renderField, this)}
                </View>
              </View>}
          </View>
        </View>
        {fields != null &&
          <View
            style={{
              position: "absolute",
              bottom: 0,
              flexDirection: "row"
            }}
          >
            <TouchableOpacity
              onPress={this.save}
              style={baseStyles.buttonBottom}
            >
              <Text style={baseStyles.textWhite}>SAVE</Text>
            </TouchableOpacity>
          </View>}
      </Wrapper>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const observation = selectActiveObservation(state);
  let type = {};

  if (observation != null) {
    type = selectFeatureType(observation.tags.surveyType, state) || {};
  }

  return {
    categories: selectAllCategories(state),
    observation,
    type
  };
};

export default connect(mapStateToProps, {
  saveObservation,
  updateObservation
})(ViewObservationScreen);
