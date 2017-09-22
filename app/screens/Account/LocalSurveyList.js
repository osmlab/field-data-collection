import React, { Component } from "react";
import { View, Switch } from "react-native";
import { connect } from "react-redux";
import { Link } from "react-router-native";
import { toggleSurveyActivity } from "../../actions";

import { osm } from "../../actions";
import { selectActiveSurveyIds } from "../../selectors";

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
    const { surveys, toggleSurveyActivity, activeIds } = this.props;

    // We want to disable the toggles if there is only one
    // active id left
    let disableToggle = activeIds.length <= 1;

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
                    disabled={survey.active && disableToggle} // Only disable active surveys
                    onValueChange={() => {
                      let { name, id } = survey.definition;
                      toggleSurveyActivity(name || id);
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
  return {
    activeIds: selectActiveSurveyIds(state).filter(x => x) // filter out null ids
  };
};

export default connect(mapStateToProps, { toggleSurveyActivity })(
  LocalSurveyList
);
