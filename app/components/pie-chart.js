import "babel-polyfill";
import React, { Component } from "react";

import Svg, { G, Path, Circle } from "react-native-svg";
import Pie from "paths-js/pie";

class PieChart extends Component {
  render() {
    let slices = [];
    const radius = this.props.radius;

    let chart = Pie({
      center: [radius, radius],
      r: radius * 0.85,
      R: radius,
      data: [
        {
          name: "complete",
          amount: this.props.complete,
          color: "#1DE9B6"
        },
        {
          name: "incomplete",
          amount: this.props.incomplete,
          color: "#FBFAFA"
        }
      ],
      accessor: item => {
        return item.amount;
      },
      compute: {
        color: (i, item) => {
          return item.color;
        }
      }
    });

    const eachSlice = (c, i) => {
      let fill = c.item.color;

      return (
        <G key={i}>
          <Path d={c.sector.path.print()} fill={fill} fillOpacity={1} />
        </G>
      );
    };

    slices = chart.curves.map(eachSlice);

    return (
      <Svg width={radius * 2} height={radius * 2}>
        <G x={0} y={0}>
          {slices}
        </G>
      </Svg>
    );
  }
}

export default PieChart;
