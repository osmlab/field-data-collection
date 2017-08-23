import React, { Component } from "react";
import { TouchableOpacity, View } from "react-native";

import { Text } from "../../components";
import { baseStyles } from "../../styles";

export default class RemoteSurveyList extends Component {
  render() {
    const { fetch, surveys, sync, close } = this.props;

    if (surveys == null || surveys.length === 0) {
      return (
        <View style={[baseStyles.wrapperContentMdInterior]}>
          <Text>Loading...</Text>
        </View>
      );
    }

    return (
      <View>
        <View style={[baseStyles.wrapperContentMdInterior]}>
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
        <View style={{ height: 620 - 219 }}>
          <TouchableOpacity onPress={close} style={baseStyles.buttonBottom}>
            <Text style={baseStyles.textWhite}>ADD SURVEY</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
