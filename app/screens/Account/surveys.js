import React, { Component } from "react";
import { StyleSheet, View, Button } from "react-native";
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

    return (
      <Wrapper>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <Text
            style={{ fontSize: 30, marginTop: -10, marginRight: 5 }}
            onPress={onBackPress}
          >
            ←
          </Text>
          <Text style={[baseStyles.title]}>Surveys</Text>
        </View>

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
          <Text style={[baseStyles.h3, baseStyles.headerWithDescription]}>
            Survey Name
          </Text>
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
