import React, { Component } from "react";

import { Text, Wrapper } from "../../components";

class AboutScreen extends Component {
  render() {
    return (
      <Wrapper navigation={this.props.navigation}>
        <Text>
          This is the screen for loading a survey
        </Text>
      </Wrapper>
    );
  }
}

export default AboutScreen;
