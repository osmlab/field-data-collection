import React, { Component } from "react";
import { TouchableOpacity, View } from "react-native";

import { Text } from "../../components";
import { baseStyles } from "../../styles";

export default class LocalSurveyList extends Component {
  render() {
    const { navigation: { navigate }, surveys } = this.props;

    if (surveys == null || surveys.length === 0) {
      return null;
    }

    return (
      <View style={{ flex: 1 }}>
        {surveys.map((survey, idx) =>
          <View
            key={idx}
            style={[
              baseStyles.wrapperContent,
              baseStyles.wrapperContentLg,
              baseStyles.listBlock,
              { flex: 1 }
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                navigate("Survey");
              }}
            >
              <Text style={[baseStyles.h3, baseStyles.headerWithDescription]}>
                {survey.definition.name}
              </Text>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              <Text>Updated: </Text>
              <Text>4/30/17 4:30pm (TBD)</Text>
            </View>
            <View
              style={[
                baseStyles.observationBlock,
                baseStyles.spaceBelowMd,
                { flexDirection: "row", flexWrap: "wrap" }
              ]}
            >
              <Text style={[baseStyles.metadataText]}>
                2 Observations (TBD)
              </Text>
              <Text style={[baseStyles.textAlert]}>(2 incomplete) (TBD)</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigate("Survey");
              }}
            >
              <Text style={[baseStyles.link]}>{"Edit".toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}
