import React, { Component } from "react";
import { View, TouchableHighlight, TouchableOpacity } from "react-native";

import Text from "./text";
import { colors } from "../styles";
import { baseStyles } from "../styles";
import { Pie } from "react-native-pathjs-charts";
import Svg, { G, Path, Circle } from "react-native-svg";
var Pie = require("paths-js/pie");

class PercentComplete extends Component {
  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }
  render() {
    let data = [
      {
        name: "complete",
        amount: 5
      },
      {
        name: "incomplete",
        amount: 3
      }
    ];

    let options = {
      margin: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      },
      width: 50,
      height: 50,
      color: "#2980B9",
      r: 15,
      R: 25,
      legendPosition: false,
      label: false
    };

    return (
      <View style={[]}>
        <View
          style={[
            {
              flex: 1,
              alignItems: "center"
            }
          ]}
        >
          <PieChart data={data} options={options} accessorKey="amount" />
          <Text style={[baseStyles.percentCompleteTextSm]}>
            <Text style={[baseStyles.percentCompleteTextNumSm]}>80%</Text>
          </Text>
        </View>
      </View>
    );
  }
}

class PieChart extends Component {
  render() {
    let chart = Pie({
      center: [0, 0],
      r,
      R,
      data: [
        {
          name: "complete",
          amount: 5
        },
        {
          name: "incomplete",
          amount: 3
        }
      ],
      accessor: "amount"
    });

    slices = chart.curves.map((c, i) => {
      let fill = (c.item.color && Colors.string(c.item.color)) || this.color(i);
      let stroke = typeof fill === "string" ? fill : Colors.darkenColor(fill);
      return (
        <G key={i}>
          <Path
            d={c.sector.path.print()}
            stroke={stroke}
            fill={fill}
            fillOpacity={1}
          />
        </G>
      );
    });

    return (
      <Svg width={50} height={50}>
        <G x={0} y={0}>
          {slices}
        </G>
      </Svg>
    );
  }
}

export default PercentComplete;
