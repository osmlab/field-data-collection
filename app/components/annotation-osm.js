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
export default function AnnotationOSM(props) {
  const { radius, active } = props;
  const diameter = radius * 2;
  const fill = active ? "#8212C6" : "#A7A7A7";

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
        style={{ width: diameter, height: diameter, zindex: 1 }}
        onPress={props.onPress}
      >
        <Svg width={diameter} height={diameter}>
          <Circle cx={radius} cy={radius} r={radius} fill={fill} />
        </Svg>
      </TouchableOpacity>
    </MapboxAnnotation>
  );
}
