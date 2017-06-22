import React, { Component } from "react";
import { StyleSheet, View, Button, TouchableOpacity } from "react-native";
import { NavigationActions } from "react-navigation";

import { Text, Wrapper } from "../../components";
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
        <Text style={[baseStyles.headerBackIcon]} onPress={onBackPress}>
          ←
        </Text>
        <Text style={[baseStyles.h3, baseStyles.headerTitle]}>Surveys</Text>
      </View>
    );

    return (
      <Wrapper navigation={this.props.navigation} headerView={headerView}>
        <View
          style={[baseStyles.wrapperContent, baseStyles.listBlock, { flex: 1 }]}
        >
          <Text style={[baseStyles.h3, baseStyles.headerWithDescription]}>
            OSM
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <Text>Updated: </Text>
            <Text>4/30/17 4:30</Text>
          </View>
          <View style={[baseStyles.observationBlock]}>
            <Text style={[baseStyles.metadataText]}>2 Observations</Text>
          </View>
        </View>
        <View
          style={[baseStyles.wrapperContent, baseStyles.listBlock, { flex: 1 }]}
        >
          <TouchableOpacity
            onPress={() => {
              navigate("Survey");
            }}
          >
            <Text style={[baseStyles.h3, baseStyles.headerWithDescription]}>
              Survey Name
            </Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <Text>Updated: </Text>
            <Text>4/30/17 4:30pm</Text>
          </View>
          <View
            style={[
              baseStyles.observationBlock,
              { flexDirection: "row", flexWrap: "wrap" }
            ]}
          >
            <Text style={[baseStyles.metadataText]}>2 Observations</Text>
            <Text style={[baseStyles.textAlert]}>(2 incomplete)</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigate("Survey");
            }}
          >
            <Text style={[baseStyles.link]}>Edit</Text>
          </TouchableOpacity>
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
