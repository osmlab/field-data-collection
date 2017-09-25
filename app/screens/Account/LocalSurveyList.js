import React, { Component } from "react";
import { View, Switch } from "react-native";
import { connect } from "react-redux";
import { Link } from "react-router-native";
import { toggleSurveyActivity } from "../../actions";

import { osm } from "../../actions";
import { selectActiveSurveyIds } from "../../selectors";

import { Text } from "../../components";
import { baseStyles } from "../../styles";

/* Switch background */
const ON_COLOR_DISABLED = "#CAFAEE";
const ON_COLOR = "#1DE9B6";
const OFF_COLOR = "#B2B2B2";

/* Switch thumb */
const ON_COLOR_DISABLED_THUMB = "#F5F7F7";
const ON_COLOR_THUMB = "#ffffff";
const OFF_COLOR_THUMB = "#ECECEC";

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
    const onTintColor = disableToggle ? ON_COLOR_DISABLED : ON_COLOR;

    if (surveys == null || surveys.length === 0) {
      return null;
    }

    return (
      <View style={{}}>
        {surveys.map((survey, idx) => {
          let thumbTintColor = ON_COLOR_THUMB;
          if (survey.active) {
            thumbTintColor = disableToggle
              ? ON_COLOR_DISABLED_THUMB
              : ON_COLOR_THUMB;
          } else {
            thumbTintColor = OFF_COLOR_THUMB;
          }

          const observationCount = this.state.surveys[survey.definition.name]
            ? this.state.surveys[survey.definition.name].observations.length
            : 0;

          return (
            <View>
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
                  <Link to={`/account/surveys/${survey.definition.name}`}>
                    <Text
                      style={[
                        baseStyles.h3,
                        baseStyles.headerWithDescription,
                        baseStyles.headerLink
                      ]}
                    >
                      {survey.definition.name}
                    </Text>
                  </Link>

                  <Switch
                    onTintColor={onTintColor}
                    tintColor={OFF_COLOR}
                    thumbTintColor={thumbTintColor}
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
                <Link
                  style={{ marginTop: 10 }}
                  to={`/account/surveys/${survey.definition.name}`}
                >
                  <Text style={[baseStyles.link]}>Edit</Text>
                </Link>
              </View>
            </View>
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
