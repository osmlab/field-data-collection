import React, { Component } from "react";
import { View, Alert } from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Link } from "react-router-native";

import { osm } from "../../actions";

import { deleteLocalSurvey } from "../../actions";
import { Text } from "../../components";
import { baseStyles } from "../../styles";

class LocalSurveyList extends Component {
  componentWillMount() {
    const { surveys } = this.props;
    this.state = { surveys: {} };

    // get observations of each survey
    surveys.forEach(survey => {
      const surveyId = survey.definition.name;
      osm.getObservationsBySurveyId(surveyId, (err, observations) => {
        const surveys = this.state.surveys;
        observations = observations || [];

        surveys[surveyId] = {
          survey,
          observations
        };

        this.setState({
          surveys,
          observations
        });
      });
    });
  }

  render() {
    const { surveys, deleteLocalSurvey } = this.props;

    if (surveys == null || surveys.length === 0) {
      return null;
    }

    return (
      <View style={{}}>
        {surveys.map((survey, idx) => {
          const observationCount = this.state.surveys[survey.definition.name]
            ? this.state.surveys[survey.definition.name].observations.length
            : 0;

          return (
            <Link to={`/account/surveys/${survey.definition.name}`}>
              <View
                key={idx}
                style={[
                  baseStyles.wrapperContent,
                  baseStyles.wrapperContentLg,
                  baseStyles.listBlock
                ]}
              >
                <View
                  style={[
                    {
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between"
                    }
                  ]}
                >
                  <Text
                    style={[baseStyles.h3, baseStyles.headerWithDescription]}
                  >
                    {survey.definition.name}
                  </Text>

                  <Icon
                    name="delete"
                    style={[[baseStyles.headerBackIcon]]}
                    onPress={() => {
                      Alert.alert(
                        `Delete ${survey.definition.name}?`,
                        "This will remove the survey from your phone, but not your observations",
                        [
                          {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                          },
                          {
                            text: "Delete survey",
                            onPress: () =>
                              deleteLocalSurvey(survey.definition.id)
                          }
                        ]
                      );
                    }}
                  />
                </View>
                <View style={{ flex: 1, flexDirection: "column" }}>
                  <Text style={{ flex: 1 }}>
                    {observationCount} Observations
                  </Text>
                </View>
              </View>
            </Link>
          );
        })}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps, { deleteLocalSurvey })(LocalSurveyList);
