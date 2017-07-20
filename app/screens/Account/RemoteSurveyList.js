import React, { Component } from "react";
import { TouchableOpacity, View } from "react-native";

import { Text } from "../../components";
import { baseStyles } from "../../styles";

export default class RemoteSurveyList extends Component {
  render() {
    const { fetch, surveys, sync } = this.props;

    if (surveys == null || surveys.length === 0) {
      return null;
    }

    return (
      <View style={{}}>
        {surveys.map((survey, idx) =>
          <TouchableOpacity
            key={idx}
            onPress={() => {
              fetch(survey.id, survey.url);
              sync(survey.target);
            }}
            style={[baseStyles.touchableLinksWrapper]}
          >
            <Text style={[baseStyles.touchableLinks]}>
              {survey.name} {survey.version}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
