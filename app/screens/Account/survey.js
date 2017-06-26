import React, { Component } from "react";
import { StyleSheet, View, Button, TouchableOpacity } from "react-native";
import { NavigationActions } from "react-navigation";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Text, Wrapper, PercentComplete } from "../../components";
import { baseStyles } from "../../styles";

class SurveysScreen extends Component {
  constructor() {
    super();
  }

  render() {
    const { navigate } = this.props.navigation;

    const onBackPress = () => {
      const backAction = NavigationActions.back();
      this.props.navigation.dispatch(backAction);
    };

    const headerView = (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center"
        }}
      >
        <TouchableOpacity onPress={onBackPress}>
          <Icon
            name="keyboard-backspace"
            style={[[baseStyles.headerBackIcon]]}
          />
        </TouchableOpacity>
        <Text style={[baseStyles.h3, baseStyles.headerTitle]}>Surveys</Text>
      </View>
    );

    return (
      <Wrapper navigation={this.props.navigation} headerView={headerView}>
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
              onPress={() => {
                navigate("Categories");
              }}
            >
              <View style={[baseStyles.map]}><Text>Map</Text></View>
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
