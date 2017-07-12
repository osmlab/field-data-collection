import React, { Component } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 80,
    backgroundColor: "white",
    zIndex: 10,
    position: "absolute",
    bottom: 80,
    right: 15
  }
});

export default function geolocate(props) {
  const success = data => {
    props.onGeolocate(null, data);
  };

  const error = err => {
    props.onGeolocate(err);
  };

  return (
    <TouchableOpacity
      style={[styles.button]}
      onPress={() => {
        navigator.geolocation.getCurrentPosition(success, error);
      }}
    >
      <Icon
        name="location-searching"
        style={{
          paddingTop: 10,
          paddingLeft: 10,
          fontSize: 40,
          color: "#cccccc"
        }}
      />
    </TouchableOpacity>
  );
}
