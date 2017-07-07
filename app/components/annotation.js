import React from "react";
import { TouchableOpacity } from "react-native";
import { Annotation as MapboxAnnotation } from "react-native-mapbox-gl";

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
      <TouchableOpacity onPress={props.onPress}>
        {props.children}
      </TouchableOpacity>
    </MapboxAnnotation>
  );
}
