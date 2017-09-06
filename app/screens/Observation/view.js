import React, { Component } from "react";
import { Image, View, TouchableOpacity, ScrollView } from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Link } from "react-router-native";

import { saveObservation, updateObservation } from "../../actions";
import {
  Text,
  Wrapper,
  Map,
  LocationModal,
  AnnotationObservation
} from "../../components";
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

    observation.tags.surveyId = surveyId;
    observation.tags.surveyType = type.id;
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
    console.log("observation", observation);
    this.setState({
      coordinates: {
        latitude: observation.lat,
        longitude: observation.lon
      }
    });
  };

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
      <Wrapper style={[baseStyles.wrapper]} headerView={headerView}>
        {modalOpen &&
          <LocationModal
            close={this.closeModal}
            onUpdateLocation={this.onUpdateLocation}
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
              {name}
            </Text>
          </View>
        </View>

        {this.renderMap()}

        <View style={{ marginTop: 20 }}>
          <View style={[baseStyles.wrapperContent]}>
            <Text style={[baseStyles.h3]}>Basic Info</Text>

            <View style={[baseStyles.fieldset, { marginBottom: 50 }]}>
              {fields.map(this.renderField, this)}
            </View>
          </View>
        </View>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            flexDirection: "row"
          }}
        >
          <TouchableOpacity onPress={this.save} style={baseStyles.buttonBottom}>
            <Text style={baseStyles.textWhite}>SAVE</Text>
          </TouchableOpacity>
        </View>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { match: { params: { surveyId, type } } } = ownProps;

  const featureType = selectFeatureType(type, state);

  return {
    observation: selectActiveObservation(state),
    surveyId,
    type: featureType
  };
};

export default connect(mapStateToProps, {
  saveObservation,
  updateObservation
})(ViewObservationScreen);
