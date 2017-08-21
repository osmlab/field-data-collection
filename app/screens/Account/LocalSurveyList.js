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
      <View style={{ flex: 0.75, justifyContent: "space-between" }}>
        {surveys.map((survey, idx) =>
          <View
            key={idx}
            style={[
              baseStyles.wrapperContent,
              baseStyles.wrapperContentLg,
              baseStyles.listBlock
            ]}
          >
            <Text style={[baseStyles.h3, baseStyles.headerWithDescription]}>
              {survey.definition.name}
            </Text>
          </View>
        )}
      </View>
    );
  }
}
