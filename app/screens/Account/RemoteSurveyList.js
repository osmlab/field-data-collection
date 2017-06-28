import React, { Component } from "react";
import { Button, View } from "react-native";

import { Text } from "../../components";
import { baseStyles } from "../../styles";

export default class RemoteSurveyList extends Component {
  render() {
    const { fetch, surveys } = this.props;

    if (surveys == null || surveys.length === 0) {
      return null;
    }

    return (
      <View style={{ flex: 1 }}>
        <Text style={[baseStyles.h3, baseStyles.headerWithDescription]}>
          Available Surveys
        </Text>
        {surveys.map((survey, idx) =>
          <Button
            key={idx}
            onPress={() => fetch(survey.id, survey.url)}
            style={{ flex: 1 }}
            title={`${survey.name} ${survey.version}`}
          />
        )}
      </View>
    );
  }
}
