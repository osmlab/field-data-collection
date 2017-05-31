import React, { Component } from "react";
import { StyleSheet, View, Button } from "react-native";

import { Text, Wrapper } from "../../components";
import { baseStyles } from "../../styles";

class AboutScreen extends Component {
  constructor() {
    super();
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <Wrapper>
        <Text>
          This is the screen for loading a survey
        </Text>
      </Wrapper>
    );
  }
}

const styles = StyleSheet.create({});

export default AboutScreen;
