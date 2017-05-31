import React, { Component } from "react";
import { StyleSheet, View, Button } from "react-native";

import { Text, Wrapper } from "../../components";
import { baseStyles } from "../../styles";

class ObservationScreen extends Component {
  constructor() {
    super();
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <Wrapper>
        <Text>
          This is an observation
        </Text>
      </Wrapper>
    );
  }
}

const styles = StyleSheet.create({});

export default ObservationScreen;
