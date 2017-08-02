import React, { Component } from "react";
import { View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import Mapbox, { MapView } from "react-native-mapbox-gl";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import { Link } from "react-router-native";

import { initializeObservation } from "../../actions";
import { selectActiveObservation, selectOsmFeatures } from "../../selectors";
import { Text, Wrapper, Map } from "../../components";
import { baseStyles } from "../../styles";

class ChoosePoint extends Component {
  componentWillMount() {}

  render() {
    const { history, initializeObservation } = this.props;

    const headerView = (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center"
        }}
      >
        <TouchableOpacity onPress={history.goBack}>
          <Icon name="keyboard-backspace" style={baseStyles.headerBackIcon} />
        </TouchableOpacity>

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
            <Map zoom={12} />
          </View>

          <View>
            <ScrollView style={{ marginTop: 6, height: 240 }}>
              {this.props.featureList.map(item => {
                return (
                  <View
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
                        initializeObservation(item.id, {
                          lat: item.lat,
                          lon: item.lon,
                          tags: { "osm-p2p-id": item.id }
                        });
                        history.push("/add-observation/categories");
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
          style={[
            baseStyles.buttonBottom,
            {
              position: "absolute",
              bottom: 0,
              right: 0,
              left: 0
            }
          ]}
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
    featureList: selectOsmFeatures(state)
  };
};

export default connect(mapStateToProps, { initializeObservation })(ChoosePoint);
