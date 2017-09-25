import { format } from "date-fns";
import React, { Component } from "react";
import { connect } from "react-redux";
import { View, ListView, TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import {
  Text,
  Wrapper,
  PercentComplete,
  AnnotationObservation,
  Map
} from "../../components";
import { baseStyles } from "../../styles";

import {
  pickSurveyType,
  calculateCompleteness
} from "../../lib/calculate-completeness";

import { osm, setActiveObservation, deleteLocalSurvey } from "../../actions";

import { selectAvailableSurveys } from "../../selectors";

class SurveysScreen extends Component {
  componentWillMount() {
    const { surveys, match: { params: { surveyId } } } = this.props;
    let { definition: { featureTypes, id } } = surveys.find(survey => {
      let { name, id } = survey.definition;
      return surveyId === (name || id);
    });

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.setState({
      observations: ds.cloneWithRows([]),
      surveyName: surveyId,
      surveyId: id
    });

    osm.getObservationsBySurveyId(surveyId, (err, observations) => {
      let resultsWithCompleteness = observations.map(observation => {
        // For each observation, pick the correct fields for that observation's
        // type and calculate completeness
        let surveyFields = pickSurveyType(featureTypes, observation);
        let percentage = calculateCompleteness(surveyFields, observation);
        return Object.assign({}, observation, { percentage });
      });

      this.setState({
        observations: ds.cloneWithRows(resultsWithCompleteness),
        numObservations: resultsWithCompleteness.length
      });
    });
  }

  render() {
    const { history, setActiveObservation, deleteLocalSurvey } = this.props;
    const { observations, numObservations, surveyId, surveyName } = this.state;

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
        <Text style={[baseStyles.h3, baseStyles.headerTitle]}>Surveys</Text>
      </View>
    );

    return (
      <Wrapper style={[baseStyles.wrapper]} headerView={headerView}>
        <View style={[baseStyles.wrapperContentHeader, baseStyles.headerPage]}>
          <Text
            style={[
              baseStyles.h2,
              baseStyles.textWhite,
              baseStyles.headerWithDescription
            ]}
          >
            {surveyName}
          </Text>
          <Text style={[baseStyles.metadataText, baseStyles.textWhite]}>
            {`${numObservations || 0} observations`}
          </Text>
        </View>
        <ListView
          style={[baseStyles.listView]}
          dataSource={observations}
          noScroll={true}
          renderRow={item => {
            const percentage = item.percentage + "%";
            const complete = parseInt(item.percentage / 10, 10);
            const incomplete = 10 - complete;

            return (
              <View style={[baseStyles.wrapperContent]}>
                <TouchableOpacity
                  style={[baseStyles.surveyCard]}
                  onPress={() => {
                    setActiveObservation(item);

                    history.push({
                      pathname: `/observation/${item.tags.surveyName}/${item
                        .tags.surveyType}`
                    });
                  }}
                >
                  <View>
                    <Map
                      center={{ latitude: item.lat, longitude: item.lon }}
                      zoom={16}
                    >
                      <AnnotationObservation
                        id={item.id}
                        owner={item.tags.deviceId}
                        coordinates={{
                          latitude: item.lat,
                          longitude: item.lon
                        }}
                      />
                    </Map>

                    {
                      <PercentComplete
                        radius={35}
                        complete={complete}
                        incomplete={incomplete}
                      >
                        <Text style={[baseStyles.percentCompleteTextSm]}>
                          <Text style={[baseStyles.percentCompleteTextNumSm]}>
                            {percentage}
                          </Text>
                        </Text>
                      </PercentComplete>
                    }

                    <View style={[baseStyles.surveyCardContent]}>
                      <Text
                        style={[
                          baseStyles.h3,
                          baseStyles.headerWithDescription,
                          baseStyles.headerLink
                        ]}
                      >
                        Observation
                      </Text>
                      <View style={[baseStyles.spaceBelow]}>
                        <View
                          style={[baseStyles.wrappedItems, baseStyles.spacer]}
                        >
                          <Text>
                            Updated:{" "}
                            {format(item.timestamp, "h:mm aa ddd, MMM D, YYYY")}
                          </Text>
                        </View>
                        <Text>
                          {item.surveyName}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />
        <View
          style={[baseStyles.wrapperContent, baseStyles.buttonContentWrapper]}
        >
          <TouchableOpacity
            style={[baseStyles.buttonOutline, { marginBottom: 40 }]}
            onPress={() => {
              Alert.alert(
                `Delete ${surveyName}?`,
                "This will remove the survey from your phone, but not your observations",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  {
                    text: "Delete survey",
                    onPress: () => {
                      deleteLocalSurvey(surveyId);
                      history.push("/account/surveys");
                    }
                  }
                ]
              );
            }}
          >
            <Text>DELETE SURVEY</Text>
          </TouchableOpacity>
        </View>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    surveys: selectAvailableSurveys(state)
  };
};

export default connect(mapStateToProps, {
  setActiveObservation,
  deleteLocalSurvey
})(SurveysScreen);
