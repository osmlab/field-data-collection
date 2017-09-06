import React, { Component } from "react";
import {
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
  ScrollView
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Text } from "../../components";
import { baseStyles } from "../../styles";

const Screen = Dimensions.get("window");

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
      <View style={[baseStyles.wrapper]}>
        <ScrollView
          style={{
            flex: 1,
            flexDirection: "column",
            height: Screen.height - 85
          }}
        >
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
                style={[baseStyles.touchableLinksWrapper, baseStyles.listBlock]}
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
        </ScrollView>

        <View
          style={{
            position: "absolute",
            bottom: 0,
            flexDirection: "row"
          }}
        >
          <TouchableOpacity onPress={close} style={baseStyles.buttonBottom}>
            <Text style={baseStyles.textWhite}>ADD SURVEYS</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
