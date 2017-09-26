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
    zIndex: 10,
    borderColor: "#D3D3D3",
    borderWidth: 1
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
        name="gps-fixed"
        style={{
          paddingTop: 12,
          paddingLeft: 12,
          fontSize: 35,
          color: "#2C2C2C"
        }}
      />
    </TouchableOpacity>
  );
}
