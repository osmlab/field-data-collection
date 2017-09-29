import React, { Component } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import { format } from "date-fns";
import { Link } from "react-router-native";

import { calculateCompleteness } from "../../lib/calculate-completeness";
import { saveObservation, updateObservation } from "../../actions";
import {
  Text,
  Wrapper,
  Map,
  LocationModal,
  ObservationTypeModal,
  AnnotationObservation,
  PercentComplete
} from "../../components";
import { getFieldType } from "../../components/fields";
import {
  selectActiveObservation,
  selectAllCategories,
  selectFeatureType,
  selectUser
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
    const { observation, updateObservation, type: { fields } } = this.props;

    // Clear previous fields if they exist
    if (fields && fields.length > 0) {
      fields.forEach(({ key }) => {
        if (observation.tags[key]) {
          delete observation.tags[key];
        }
      });
    }

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
    const { saveObservation, observation, user } = this.props;

    observation.tags.userName = user.name || "";
    observation.tags.userEmail = user.email || "";

    if (observation.lat && observation.lon) {
      return saveObservation(observation);
    }

    // alert user if lat/lon don't exist
    Alert.alert(
      `Location required`,
      "Make sure to add a location before saving the observation.",
      [
        {
          text: "Add location",
          onPress: () => this.openLocationModal()
        }
      ]
    );
  };

  onUpdateLocation = coordinates => {
    const { updateObservation } = this.props;
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
    const { observation, user: { deviceId } } = this.props;

    const locationText =
      observation.lat && observation.lon ? "EDIT LOCATION" : "ADD LOCATION";

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
            owner={deviceId}
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

    const percent = calculateCompleteness(fields, observation);
    const complete = parseInt(percent / 10, 10);
    const incomplete = 10 - complete;

    const { locationModalOpen, observationTypeModalOpen } = this.state;
    console.log("OBSERVATION NAME", observation.tags);

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
          {observation.id != null ? "Observation" : "New Observation"}
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
            <Text
              style={[
                baseStyles.h2,
                baseStyles.textWhite,
                baseStyles.headerWithDescription
              ]}
            >
              {observation.id != null
                ? "Observation Details"
                : "Add Observation Details"}
            </Text>
            {fields != null
              ? <Text style={{ color: "#E9E9E9", marginBottom: 5 }}>
                  {" "}Survey: {observation.tags.surveyId}
                </Text>
              : <View />}
            {observation.timestamp != null
              ? <Text style={{ color: "#E9E9E9" }}>
                  {" "}Updated:{" "}
                  {format(observation.timestamp, "h:mm aa ddd, MMM D, YYYY")}
                </Text>
              : <View />}
          </View>
          <View style={[baseStyles.percentCompleteWrapper, { paddingTop: 35 }]}>
            {fields /* Don't render if we don't have a survey type yet */
              ? <PercentComplete
                  radius={35}
                  complete={complete}
                  incomplete={incomplete}
                >
                  <Text style={[baseStyles.percentCompleteTextSm]}>
                    <Text style={[baseStyles.percentCompleteTextNumSm]}>
                      {percent + "%"}
                    </Text>
                  </Text>
                </PercentComplete>
              : <View />}
          </View>
        </View>
        <View style={{ borderBottomWidth: 1, borderBottomColor: "#D6D5D5" }}>
          {this.renderMap()}
        </View>
        <View style={{ marginTop: 30 }}>
          <View style={[baseStyles.wrapperContent]}>
            <Text style={[baseStyles.h4, { marginBottom: 8 }]}>
              Select Observation Type
            </Text>
            <TouchableOpacity
              onPress={this.openObservationTypeModal}
              style={[baseStyles.fieldset, { marginBottom: 20 }]}
            >
              <View style={[baseStyles.field]}>
                <View style={[baseStyles.wrappedItemsLg]}>
                  <Text style={[baseStyles.h5]}>TYPE</Text>
                  <Text style={[baseStyles.fieldValue]}>
                    {name}
                  </Text>
                </View>
                <View style={baseStyles.wrappedItemsSm}>
                  <Icon
                    name="keyboard-arrow-right"
                    style={baseStyles.formArrowCategories}
                  />
                </View>
              </View>
            </TouchableOpacity>

            {fields != null &&
              <View style={{ marginTop: 20 }}>
                <Text style={[baseStyles.h4, { marginBottom: 8 }]}>
                  Basic Information
                </Text>

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
  const user = selectUser(state);
  let type = {};

  if (observation != null) {
    type = selectFeatureType(observation.tags.surveyType, state) || {};
  }

  return {
    categories: selectAllCategories(state),
    observation,
    user,
    type
  };
};

export default connect(mapStateToProps, {
  saveObservation,
  updateObservation
})(ViewObservationScreen);
