import React, { Component } from "react";
import { TouchableOpacity, View, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Text } from "../../components";
import { baseStyles } from "../../styles";

export default class RemoteSurveyList extends Component {
  isActive = survey => {
    const { activeSurveys } = this.props;

    // TODO: check version of survey
    return !!activeSurveys.find(s => {
      console.log(s.definition.name, survey.name);
      return s.definition.name === survey.name;
    });
  };

  render() {
    const { fetch, surveys, sync, close } = this.props;

    if (surveys == null || surveys.length === 0) {
      return (
        <View style={[baseStyles.wrapperContentMdInterior]}>
          <ActivityIndicator
            style={{ marginTop: 50, marginBottom: 20 }}
            animating
            size="large"
          />
          <Text style={{ textAlign: "center" }}>Loading surveys</Text>
        </View>
      );
    }

    return (
      <View>
        <View style={[baseStyles.wrapperContentMdInterior]}>
          {surveys.map((survey, idx) => {
            const active = this.isActive(survey);

            return (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  if (active) return;

                  fetch(survey.id, survey.url);
                  sync(survey.target);
                }}
                style={[baseStyles.touchableLinksWrapper]}
              >
                <Text style={baseStyles.touchableLinks}>
                  {survey.name} {survey.version}
                </Text>

                {active &&
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      flexDirection: "row",
                      marginTop: 5
                    }}
                  >
                    <Icon
                      name="check"
                      size={14}
                      style={{ color: "#575456", marginTop: 3 }}
                    />
                    <Text
                      style={{
                        color: "#ccc",
                        fontSize: 16,
                        fontWeight: "bold"
                      }}
                    >
                      Synced
                    </Text>
                  </View>}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 620 - 219 }}>
          <TouchableOpacity onPress={close} style={baseStyles.buttonBottom}>
            <Text style={baseStyles.textWhite}>ADD SURVEYS</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
