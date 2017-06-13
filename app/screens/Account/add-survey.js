import React, { Component } from "react";
import { View, Button } from "react-native";

import { Text, Wrapper } from "../../components";
import { baseStyles } from "../../styles";

import websocket from "websocket-stream";

import hyperlog from "hyperlog";
const levelup = require("levelup");
const asyncstorage = require("asyncstorage-down");

import osmp2p from "../../../osm-p2p";
var osm = osmp2p();

osm.create({ type: "node", lat: 64.6, lon: -147.8 }, (err, key, node) => {
  if (err) return console.error("error", err);
  console.log("created key", key, "node", node);

  osm.query([[64, 65], [-148, -147]], function(err, pts) {
    if (err) console.error(err);
    console.log("pts", pts);
  });
});

class AddSurveyScreen extends Component {
  render() {
    return (
      <Wrapper>
        <View style={baseStyles.container}>
          <View onPress={() => {}}>
            <Text> ← </Text>
          </View>

          <Text style={baseStyles.title}>
            Add a survey
          </Text>

          <Button
            title="Add survey"
            onPress={() => {
              console.log("sync started");
              const ws = websocket("ws://10.0.2.2:3131");
              var stream = osm.log.replicate();
              stream.on("error", console.log);
              stream.pipe(ws).pipe(stream);
            }}
          />
        </View>
      </Wrapper>
    );
  }
}

export default AddSurveyScreen;
