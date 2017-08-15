import React, { Component } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import getCurrentPosition from "../lib/get-current-position";

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 80,
    backgroundColor: "white",
    zIndex: 10
  }
});

export default function geolocate(props) {
  return (
    <TouchableOpacity
      style={[styles.button]}
      onPress={() => {
        getCurrentPosition(props.onGeolocate);
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
