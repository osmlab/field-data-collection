import React, { Component } from "react";
import {
  Image,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Link } from "react-router-native";
import { format } from "date-fns";

import { initializeObservation, setActiveObservation } from "../../actions";
import { Text, Wrapper, Map, AnnotationOSM } from "../../components";
import {
  pickSurveyType,
  calculateCompleteness
} from "../../lib/calculate-completeness";
import { selectFeatureTypes } from "../../selectors";
import { baseStyles } from "../../styles";

const Screen = Dimensions.get("window");

class ViewOsmFeature extends Component {
  coordinatesToString = coords => {
    const lat = (coords.lat || coords.latitude).toFixed(3);
    const lon = (coords.lon || coords.longitude).toFixed(3);
    return `Lat: ${lat} Lon: ${lon}`;
  };

  render() {
    const { history } = this.props;
    const { feature } = this.props.location.state;
    const featureName =
      (feature.tags && feature.tags.name) || this.coordinatesToString(feature);

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
        <Text style={[baseStyles.h3, baseStyles.headerTitle]}>Point</Text>
      </View>
    );

    return (
      <Wrapper headerView={headerView}>
        <ScrollView
          style={{
            flex: 1,
            flexDirection: "column",
            height: Screen.height - 85
          }}
        >
          <View
            style={[
              baseStyles.wrapperContentHeader,
              baseStyles.headerPage,
              { paddingBottom: 30 }
            ]}
          >
            <View style={[]}>
              <Text
                style={[baseStyles.h2, baseStyles.textWhite, { paddingTop: 6 }]}
              >
                {featureName}
              </Text>
            </View>
          </View>
          <View style={{ borderBottomWidth: 1, borderBottomColor: "#D6D5D5" }}>
            {this.renderMap()}
          </View>
          <View style={{ marginTop: 30 }}>
            <View style={[baseStyles.wrapperContent]}>
              {this.renderObservations()}
            </View>
          </View>
        </ScrollView>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            flexDirection: "row"
          }}
        >
          <TouchableOpacity
            onPress={this.addNewObservation}
            style={baseStyles.buttonBottom}
          >
            <Text style={baseStyles.textWhite}>ADD NEW OBSERVATION</Text>
          </TouchableOpacity>
        </View>
      </Wrapper>
    );
  }

  addNewObservation = () => {
    const { initializeObservation, history } = this.props;
    const { feature } = this.props.location.state;

    initializeObservation({
      lat: feature.lat,
      lon: feature.lon,
      tags: {
        "osm-p2p-id": feature.id
      }
    });

    history.push("/observation");
  };

  setRef = map => {
    this._map = map;
  };

  renderMap = () => {
    const { feature } = this.props.location.state;
    const coordinates = { latitude: feature.lat, longitude: feature.lon };

    return (
      <View style={[baseStyles.mapLg]}>
        <Map mapref={this.setRef} height={250} zoom={14} center={coordinates}>
          <AnnotationOSM
            id="osm"
            coordinates={coordinates}
            radius={8}
            active={true}
          />
        </Map>

        <View style={baseStyles.mapEditorBlock}>
          <Text style={{}}>
            {this.coordinatesToString(coordinates)}
          </Text>
        </View>
      </View>
    );
  };

  renderObservations = () => {
    const { history, location, setActiveObservation, types } = this.props;
    const { feature: { observations } } = location.state;
    let observationList;

    if (observations.length) {
      observationList = observations.map(obs => {
        const surveyId = obs.tags.surveyId;
        const surveyType = obs.tags.surveyType;

        console.log("obs", obs);
        const survey = pickSurveyType(types, obs);
        const percent = calculateCompleteness(survey, obs);

        return (
          <TouchableOpacity
            key={`obs-link-${obs.id}`}
            onPress={() => {
              setActiveObservation(obs);

              history.push({
                pathname: `/observation/${surveyId}/${surveyType}`
              });
            }}
          >
            <View ref={x => (this._root = x)} style={[baseStyles.field]}>
              <View>
                <Text style={[baseStyles.h4, baseStyles.headerWithDescription]}>
                  Observation
                </Text>
                <Text style={[{ marginBottom: 10 }]}>
                  Updated: {format(obs.timestamp, "h:mm aa ddd, MMM D, YYYY")}
                </Text>
                <Text>
                  {percent + "%"} complete.
                </Text>
              </View>
              <View>
                <Icon
                  name="keyboard-arrow-right"
                  style={[[baseStyles.formArrow]]}
                />
              </View>
            </View>
          </TouchableOpacity>
        );
      });
    } else {
      observationList = (
        <Text style={[baseStyles.metadataText]}>
          None yet. Create a new one
        </Text>
      );
    }

    return (
      <View>
        <Text style={[baseStyles.h3]}>Observations</Text>
        <View style={[baseStyles.fieldset, { marginBottom: 50 }]}>
          {observationList}
        </View>
      </View>
    );
  };
}

const mapStateToProps = (state, ownProps) => {
  return {
    types: selectFeatureTypes(state)
  };
};

export default connect(mapStateToProps, {
  initializeObservation,
  setActiveObservation
})(ViewOsmFeature);
