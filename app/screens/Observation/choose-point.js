import React, { Component } from "react";
import { View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import { Link } from "react-router-native";

import getCenterOfPoints from "../../lib/get-center-of-points";
import { initializeObservation } from "../../actions";
import {
  selectActiveObservation,
  selectSelectedFeatures,
  selectVisibleFeatures
} from "../../selectors";
import { Text, Wrapper, Map, AnnotationOSM } from "../../components";
import { baseStyles } from "../../styles";

class ChoosePoint extends Component {
  items = {};
  state = {};

  setItemRef = key => {
    return view => {
      this.items[key] = view;
    };
  };

  render() {
    const {
      history,
      initializeObservation,
      selectedFeatures,
      visibleFeatures
    } = this.props;
    const features =
      selectedFeatures.length > 0 ? selectedFeatures : visibleFeatures;
    const center = features.length > 0 ? getCenterOfPoints(features) : false;

    let annotations = features.map(item => {
      var active =
        this.state.activeFeature && this.state.activeFeature.id === item.id;
      return (
        <AnnotationOSM
          key={item.id}
          id={item.id}
          radius={8}
          coordinates={{ latitude: item.lat, longitude: item.lon }}
          onPress={this.onMapPress}
          active={active}
        />
      );
    });

    const headerView = (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center"
        }}
      >
        <Link to="/">
          <Icon name="keyboard-backspace" style={baseStyles.headerBackIcon} />
        </Link>

        <Text style={[baseStyles.h3, baseStyles.headerTitle]}>Add</Text>
      </View>
    );

    return (
      <Wrapper headerView={headerView}>
        <View
          style={[
            baseStyles.wrapperContent,
            {
              flex: 1,
              flexDirection: "column",
              paddingBottom: 65
            }
          ]}
        >
          <View>
            <Text style={baseStyles.h2}>
              What are you adding an observation to?
            </Text>

            <Map center={center}>
              {annotations}
            </Map>
          </View>

          <View
            onLayout={e => {
              this.parentY = e.nativeEvent.layout.y;
            }}
          >
            <ScrollView
              ref="scrollview"
              style={{ marginTop: 6, height: 240 }}
              onScroll={e => {
                const yOffset = e.nativeEvent.contentOffset.y;

                let active;

                Object.keys(this.items).forEach(key => {
                  const item = this.items[key];
                  const feature = features.find(f => f.id === key);

                  item.measure((x, y, w, h, pX, pY) => {
                    if (!active) {
                      active = { item, pY, feature };
                    }

                    const activeDiff = active.pY - this.parentY;
                    const diff = pY - this.parentY;

                    if (diff > 0 && (diff <= activeDiff || activeDiff < 0)) {
                      active = { item, pY, feature };
                      this.setState({ activeFeature: feature });

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
                return (
                  <View
                    ref={this.setItemRef(item.id)}
                    key={item.id}
                    style={{
                      marginTop: 6,
                      marginBottom: 6,
                      borderColor: "#ccc",
                      borderWidth: 1
                    }}
                  >
                    <TouchableOpacity
                      style={{ padding: 20 }}
                      onPress={() => {
                        initializeObservation({
                          lat: item.lat,
                          lon: item.lon,
                          tags: { "osm-p2p-id": item.id }
                        });

                        history.push("/observation/categories");
                      }}
                    >
                      <Text style={baseStyles.h3}>
                        {item.tags.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>

        <TouchableOpacity
          style={baseStyles.buttonBottom}
          onPress={() => {
            initializeObservation({
              lat: null,
              lon: null,
              tags: { "osm-p2p-id": null }
            });

            history.push("/observation/categories");
          }}
        >
          <Text style={{ color: "#ffffff" }}>ADD TO A NEW POINT</Text>
        </TouchableOpacity>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    observation: selectActiveObservation(state),
    selectedFeatures: selectSelectedFeatures(state),
    visibleFeatures: selectVisibleFeatures(state)
  };
};

export default connect(mapStateToProps, {
  initializeObservation
})(ChoosePoint);
