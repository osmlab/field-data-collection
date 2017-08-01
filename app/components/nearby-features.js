import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated
} from "react-native";

import Interactable from "react-native-interactable";

import Text from "./text";
import { colors } from "../styles";
import { baseStyles } from "../styles";

const Screen = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height - 75
};

class NearbyFeatures extends Component {
  constructor(props) {
    super(props);
    this._deltaY = new Animated.Value(Screen.height - 100);
  }

  open = () => {
    this._drawer.setVelocity({ y: -1000 });
    this.setState({
      drawerOpen: true
    });
  };

  close = () => {
    this._drawer.setVelocity({ y: 1000 });
    this.setState({
      drawerOpen: false
    });
  };

  toggle = () => {
    this.state.drawerOpen ? this.close() : this.open();
  };

  componentWillMount() {
    this.setState({
      drawerOpen: false
    });
  }

  render() {
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        }}
      >
        <Interactable.View
          style={baseStyles.nearbyPoints}
          verticalOnly={true}
          initialPosition={{ y: Screen.height - 32 }}
          snapPoints={[{ y: Screen.height - 200 }, { y: Screen.height - 32 }]}
          boundaries={{ top: Screen.height - 210 }}
          ref={view => {
            this._drawer = view;
          }}
        >
          <View style={[baseStyles.nearbyPointsHeader]}>
            <View style={[baseStyles.nearbyPointsDescription]}>
              <TouchableOpacity onPress={this.toggle}>
                <Text style={[baseStyles.h4]}>Nearby Points</Text>

                {this.props.userLocation &&
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    <Text>Location: </Text>
                    <Text>
                      {this.props.userLocation.latitude.toFixed(2)},{" "}
                      {this.props.userLocation.longitude.toFixed(2)}
                    </Text>
                  </View>}
              </TouchableOpacity>
            </View>

            {/*
            // hide filter button temporarily
            <View style={{}}>
              <TouchableOpacity
                style={[baseStyles.buttonOutline]}
                onPress={this._onPressButton}
              >
                <Text>Filter</Text>
              </TouchableOpacity>
            </View>
            */}
          </View>

          <ScrollView horizontal={true} width={Screen.width}>
            {this.props.features.map(item => {
              return (
                <View style={[baseStyles.cardStyle]} key={item.id}>
                  <Text style={[baseStyles.h3]}>
                    {item.tags.name}
                  </Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    <Text>30cm away</Text>
                    <View>
                      <Text>Updated: </Text>
                      <Text>4/30/17 4:30</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      baseStyles.observationBlock,
                      { flexDirection: "row", flexWrap: "wrap" }
                    ]}
                  >
                    <Text style={[baseStyles.metadataText]}>
                      2 Observations
                    </Text>
                    <Text style={[baseStyles.textAlert]}>(2 incomplete)</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </Interactable.View>
      </View>
    );
  }
}

export default NearbyFeatures;
