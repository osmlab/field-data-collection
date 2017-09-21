import React, { Component } from "react";
import { View, Switch } from "react-native";
import { connect } from "react-redux";
import { Link } from "react-router-native";
import { toggleSurveyActivity } from "../../actions";

import { osm } from "../../actions";

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
    const { surveys, toggleSurveyActivity } = this.props;

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

                  <Switch
                    value={survey.active}
                    onValueChange={() => {
                      toggleSurveyActivity(survey.definition.id);
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

export default connect(mapStateToProps, { toggleSurveyActivity })(
  LocalSurveyList
);
