import React, { Component } from "react";
import { StyleSheet, View, Button } from "react-native";

import { Text, Wrapper } from "../../components";
import { baseStyles } from "../../styles";

class AddSurveyScreen extends Component {
  constructor() {
    super();
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <Wrapper>
        <View style={baseStyles.container}>
          <View onPress={() => {}}>
            <Text> ← </Text>
          </View>

          <Text style={baseStyles.title}>
            Add a survey
          </Text>

        </View>
      </Wrapper>
    );
  }
}

const styles = StyleSheet.create({});

export default AddSurveyScreen;
