import React, { Component } from "react";
import { View, TouchableHighlight, TouchableOpacity } from "react-native";

import Text from "./text";
import { colors } from "../styles";
import { baseStyles } from "../styles";
import PieChart from "react-native-pie-chart";

class PercentComplete extends Component {
  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }
  render() {
    return (
      <View style={[baseStyles.percentCompleteWrapper]}>
        <View style={[baseStyles.percentComplete]}>
          <PieChart
            style={{ alignSelf: "center" }}
            chart_wh={50}
            series={[80]}
            sliceColor={["#1DE9B6"]}
            doughnut={true}
            coverRadius={0.7}
            coverFill={"#FFF"}
          />
          <Text style={[baseStyles.percentCompleteTextSm]}>
            <Text style={[baseStyles.percentCompleteTextNumSm]}>80%</Text>
          </Text>
        </View>
      </View>
    );
  }
}

export default PercentComplete;
