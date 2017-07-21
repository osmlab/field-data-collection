import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Button,
  TouchableOpacity,
  TouchableHighlight
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Text, Wrapper, PercentComplete } from "../../components";
import { baseStyles } from "../../styles";

class SurveysScreen extends Component {
  render() {
    const { history } = this.props;

    const headerView = (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center"
        }}
      >
        <TouchableOpacity onPress={history.goBack}>
          <Icon
            name="keyboard-backspace"
            style={[[baseStyles.headerBackIcon]]}
          />
        </TouchableOpacity>
        <Text style={[baseStyles.h3, baseStyles.headerTitle]}>Surveys</Text>
      </View>
    );

    return (
      <Wrapper headerView={headerView}>
        <View style={[]}>
          <View
            style={[baseStyles.wrapperContentHeader, baseStyles.headerPage]}
          >
            <Text
              style={[
                baseStyles.h2,
                baseStyles.textWhite,
                baseStyles.headerWithDescription
              ]}
            >
              Survey Name
            </Text>
            <Text style={[baseStyles.metadataText, baseStyles.textWhite]}>
              2 observations
            </Text>
          </View>
          <View style={[baseStyles.wrapperContent]}>
            <TouchableOpacity
              style={[baseStyles.surveyCard]}
              onPress={() => {}}
            >
              <View style={[baseStyles.map]}>
                <Text>Map</Text>
              </View>
              <PercentComplete />
              <View style={[baseStyles.surveyCardContent]}>
                <Text style={[baseStyles.h3, baseStyles.headerWithDescription]}>
                  Name of Observation
                </Text>
                <View
                  style={[
                    baseStyles.spaceBelow,
                    { flexDirection: "row", flexWrap: "wrap" }
                  ]}
                >
                  <Text style={[baseStyles.withPipe]}>30cm away |</Text>
                  <Text>Updated: </Text>
                  <Text>4/30/17 4:30</Text>
                </View>
                <Text>Category</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Wrapper>
    );
  }
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 17
  }
});

export default SurveysScreen;
