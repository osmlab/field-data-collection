import React from "react";
import { TouchableOpacity } from "react-native";
import { Annotation as MapboxAnnotation } from "react-native-mapbox-gl";
import Svg, { G, Path, Circle } from "react-native-svg";

/**
* wrapper around react-native-mapbox-gl Annotation component
*
* @example
* var annotations = geojson.map((item) => {
*   return (
*     <Annotation id={item.id}, coordinates={item.geometry.coordinates}>
*       <Text>hi</Text>
*     </Annotation>
*   )
* })
**/
export default function Annotation(props) {
  const { radius } = props;
  const diameter = radius * 2;

  return (
    <MapboxAnnotation
      id={props.id}
      coordinate={props.coordinates}
      style={{
        alignItems: "center",
        justifyContent: "center",
        position: "absolute"
      }}
    >
      <TouchableOpacity
        style={{ width: diameter, height: diameter }}
        onPress={props.onPress}
      >
        <Svg width={diameter} height={diameter}>
          <Circle cx={radius} cy={radius} r={radius} fill="#575456" />
        </Svg>
      </TouchableOpacity>
    </MapboxAnnotation>
  );
}
