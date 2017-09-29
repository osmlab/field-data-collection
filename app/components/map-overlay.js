import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  ActivityIndicator
} from "react-native";
import turf from "turf";

import { max as maxDate, distanceInWordsToNow } from "date-fns";

import Icon from "react-native-vector-icons/MaterialIcons";
import Interactable from "react-native-interactable";
import { Link } from "react-router-native";

import Text from "./text";
import Geolocate from "./geolocate";

import { colors } from "../styles";
import { baseStyles } from "../styles";

const Screen = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height - 75
};

class MapOverlay extends Component {
  constructor(props) {
    super(props);
    this._deltaY = new Animated.Value(Screen.height - 80);
    this.items = {};
    this.shouldOpen = false;
    this.shouldScrollback = false;
  }

  setItemRef = key => {
    return view => {
      this.items[key] = view;
    };
  };

  open = () => {
    this._drawer.setVelocity({ y: -1000 });
    this.setState({
      drawerOpen: true
    });
  };

  close = () => {
    this._drawer.setVelocity({ y: 1000 });
    this._scrollView.scrollTo({ x: 0 });
    this.setState({
      drawerOpen: false
    });
  };

  toggle = () => {
    this.state.drawerOpen ? this.close() : this.open();
  };

  componentWillMount() {
    this.setState({
      drawerOpen: false,
      features: []
    });
  }

  componentWillReceiveProps(nextProps) {
    let { features, observations, pressedFeature } = nextProps;
    features.forEach(feature => {
      feature.observations = observations.filter(
        obs => obs.tags["osm-p2p-id"] === feature.id
      );
      return feature;
    });

    let sortedFeatures = features.slice(0).sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      }
      if (a.id > b.id) {
        return 1;
      }
      return 0;
    });

    let shouldUpdate = false;

    // If the user has selected a feature, we want to put that at the top of
    // the list
    if (pressedFeature) {
      let firstIndex = sortedFeatures.findIndex(
        feature => feature.id === pressedFeature.id
      );
      if (firstIndex > -1) {
        let firstFeature = sortedFeatures[firstIndex];
        sortedFeatures.splice(firstIndex, 1);
        sortedFeatures.unshift(firstFeature);
      }

      shouldUpdate =
        !this.state.pressedFeature ||
        pressedFeature.id !== this.state.pressedFeature.id;
      this.shouldOpen = shouldUpdate && !this.drawerOpen;
      this.shouldScrollback = shouldUpdate;
    }

    let prevFeatures = this.state.features.slice(0);
    if (prevFeatures.length !== sortedFeatures.length) {
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      this.setState({
        features: sortedFeatures,
        pressedFeature
      });
    }
  }

  componentDidUpdate() {
    if (!this.state.drawerOpen && this.shouldOpen) {
      this.open();
    }
    if (this.shouldScrollback && this._drawer) {
      this._scrollView.scrollTo({ x: 0 });
    }
  }

  renderNearbyPoints = () => {
    const {
      activeSurveys,
      loading,
      querying,
      activeFeature,
      userLocation
    } = this.props;

    let features = this.state.features;

    if (!activeSurveys.length) {
      return (
        <View style={baseStyles.nearbyPoints}>
          <View style={[baseStyles.nearbyPointsHeader]}>
            <View
              style={[baseStyles.nearbyPointsDescription, { paddingTop: 10 }]}
            >
              <Link to="/account/surveys">
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start"
                  }}
                >
                  <Icon name="add" style={{ fontSize: 20 }} />
                  <Text style={[baseStyles.touchableLinks, { fontSize: 20 }]}>
                    Add a survey to get started
                  </Text>
                </View>
              </Link>
            </View>
          </View>
        </View>
      );
    }

    if (loading) {
      return (
        <View style={baseStyles.nearbyPoints}>
          <View style={[baseStyles.nearbyPointsHeader]}>
            <View
              style={[
                baseStyles.nearbyPointsDescription,
                {
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  paddingTop: 10
                }
              ]}
            >
              <ActivityIndicator
                animating
                size="large"
                style={{ marginRight: 15 }}
              />
              <Text style={{ fontSize: 20 }}>Loading data</Text>
            </View>
          </View>
        </View>
      );
    }

    if (userLocation) {
      const userLatitude = userLocation.latitude;
      const userLongitude = userLocation.longitude;
      var origin = turf.point([userLongitude, userLatitude]);
    }

    return (
      <View style={baseStyles.nearbyPoints}>
        <View style={[baseStyles.nearbyPointsHeader]}>
          <View
            style={[
              baseStyles.nearbyPointsDescription,
              { flexDirection: "row" }
            ]}
          >
            <TouchableOpacity onPress={this.toggle}>
              <Text style={[baseStyles.h4]}>
                {features.length.toLocaleString()} Nearby Points
              </Text>

              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {userLocation
                  ? <Text>
                      Location: {userLocation.latitude.toFixed(2)},{" "}
                      {userLocation.longitude.toFixed(2)}
                    </Text>
                  : <Text>Geolocating...</Text>}
              </View>
            </TouchableOpacity>
            {querying &&
              <ActivityIndicator
                animating
                size="large"
                style={{ marginLeft: 30 }}
              />}
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

        <ScrollView
          ref={scrollview => (this._scrollView = scrollview)}
          horizontal={true}
          width={Screen.width}
          onScroll={e => {
            const xOffset = e.nativeEvent.contentOffset.x;
            let active;

            Object.keys(this.items).forEach((key, i) => {
              const item = this.items[key];
              const feature = features.find(f => f.id === key);
              if (!item) return;

              item.measure((x, y, w, h, pX, pY) => {
                if (!active) {
                  active = { item, pX, feature };
                }

                // first item needs extra space
                const isFirstItem = i === 0 && pX >= -10;
                const isActive =
                  pX > 0 && (pX <= active.pX || active.pX < 0) && xOffset > 10;

                if (isFirstItem || isActive) {
                  active = { item, pX, feature };
                  activeFeature(feature);

                  item.setNativeProps({
                    style: {
                      borderColor: "#8212C6"
                    }
                  });
                } else {
                  item.setNativeProps({
                    style: {
                      borderColor: "#ccc"
                    }
                  });
                }
              });
            });
          }}
        >
          {features.map(item => {
            /** Calculate distance from user */
            let distanceLabel = "km";
            let distance = 0;
            if (item.lon && item.lat && origin) {
              const location = turf.point([item.lon, item.lat]);
              distance = turf.distance(origin, location);

              if (distance < 1) {
                distance *= 1000;
                distanceLabel = "m";
              }
            }

            /** Calculate last updated */
            let dates = [];
            item.observations.forEach(obs => {
              if (obs.timestamp) dates.push(obs.timestamp);
            });
            let lastUpdated = "";
            if (dates.length) {
              lastUpdated = ` | Updated: ${distanceInWordsToNow(
                maxDate(dates)
              )} ago`;
            }

            return (
              <View
                ref={this.setItemRef(item.id)}
                style={[baseStyles.cardStyle]}
                key={item.id}
              >
                <Link
                  to={{
                    pathname: `/feature/${item.id}`,
                    state: { feature: item }
                  }}
                >
                  <Text
                    style={[
                      baseStyles.h3,
                      baseStyles.headerWithDescription,
                      baseStyles.headerLink
                    ]}
                  >
                    {item.tags.name}
                  </Text>
                </Link>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  <Text style={{ fontSize: 13 }}>
                    {`${distance.toFixed(2)} ${distanceLabel}`} away
                  </Text>
                  <Text style={{ fontSize: 13 }}>
                    {lastUpdated}
                  </Text>
                </View>
                <View
                  style={[
                    baseStyles.observationBlock,
                    { flexDirection: "row", flexWrap: "wrap" }
                  ]}
                >
                  <Text style={[baseStyles.metadataText, { marginTop: 10 }]}>
                    {item.observations.length}{" "}
                    {item.observations.length === 1
                      ? "Observation"
                      : "Observations"}
                  </Text>
                  {/*<Text style={[baseStyles.textAlert]}>(2 incomplete)</Text>*/}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  render() {
    const { onGeolocate, observations, userLocation, history } = this.props;
    const closed = Screen.height - 45;
    const open = Screen.height - 210;
    let features = this.state.features;

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
        <Animated.View
          style={{
            position: "absolute",
            right: 0,
            bottom: 280,
            width: 75,
            height: 140,
            transform: [
              {
                translateY: this._deltaY.interpolate({
                  inputRange: [open, closed],
                  outputRange: [1, 170]
                })
              }
            ]
          }}
        >
          <Geolocate onGeolocate={onGeolocate} />

          <TouchableOpacity
            onPress={() => {
              if (features.length > 0) {
                history.push("/observation/choose-point", {
                  addPoint: true,
                  observations: observations
                });
              } else {
                if (userLocation) {
                  const userLatitude = userLocation.latitude;
                  const userLongitude = userLocation.longitude;
                  this.props.initializeObservation({
                    lat: userLatitude,
                    lon: userLongitude,
                    tags: { "osm-p2p-id": null }
                  });
                  history.push("/observation");
                }
              }
            }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 80,
              backgroundColor: "#8212C6",
              zIndex: 10,
              position: "absolute",
              right: 15,
              marginTop: 75
            }}
          >
            <Icon
              name="add"
              style={{
                paddingTop: 10,
                paddingLeft: 10,
                fontSize: 40,
                color: "#ffffff"
              }}
            />
          </TouchableOpacity>
        </Animated.View>

        <Interactable.View
          style={{
            height: 400
          }}
          verticalOnly={true}
          initialPosition={{ y: closed }}
          dragEnabled={false}
          snapPoints={[{ y: open }, { y: closed }]}
          boundaries={{ top: open + 10 }}
          ref={view => {
            this._drawer = view;
          }}
          animatedValueY={this._deltaY}
        >
          {this.renderNearbyPoints()}
        </Interactable.View>
      </View>
    );
  }
}

export default MapOverlay;
