import React, { Component } from "react";
import { View } from "react-native";

import { Text } from "../../components";
import { baseStyles } from "../../styles";

export default class LocalSurveyList extends Component {
  render() {
    const { surveys } = this.props;

    if (surveys == null || surveys.length === 0) {
      return null;
    }

    return (
      <View style={{ flex: 1 }}>
        <Text style={[baseStyles.h3, baseStyles.headerWithDescription]}>
          Loaded Surveys
        </Text>
        {surveys.map((survey, idx) =>
          <Text key={idx} style={{ flex: 1 }}>
            {survey.definition.name} {survey.definition.version}
          </Text>
        )}
      </View>
    );
  }
}
