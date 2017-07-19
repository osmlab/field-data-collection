import React, { Component } from "react";
import { View, Button } from "react-native";

import { Text, Wrapper } from "../../components";
import { baseStyles } from "../../styles";

class AddSurveyScreen extends Component {
  render() {
    return (
      <Wrapper>
        <View style={baseStyles.container}>
          <View onPress={() => {}}>
            <Text> ← </Text>
          </View>

          <Text style={baseStyles.title}>Add a survey</Text>
        </View>
      </Wrapper>
    );
  }
}

export default AddSurveyScreen;
