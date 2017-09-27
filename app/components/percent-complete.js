import React, { Component } from "react";
import { View, TouchableHighlight, TouchableOpacity } from "react-native";

import Text from "./text";
import PieChart from "./pie-chart";
import { colors } from "../styles";
import { baseStyles } from "../styles";

class PercentComplete extends Component {
  render() {
    return (
      <View style={baseStyles.percentComplete}>
        <PieChart {...this.props} />
        {this.props.children}
      </View>
    );
  }
}

export default PercentComplete;
