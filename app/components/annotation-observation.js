import React from "react";
import { TouchableOpacity } from "react-native";
import { Annotation as MapboxAnnotation } from "react-native-mapbox-gl";
import Icon from "react-native-vector-icons/MaterialIcons";

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
export default function AnnotationObservation(props) {
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
        style={{ width: 40, height: 55, paddingTop: 0, paddingLeft: 5 }}
        onPress={props.onPress}
      >
        <Icon name="location-on" size={30} style={{ color: "#6579fc" }} />
      </TouchableOpacity>
    </MapboxAnnotation>
  );
}
