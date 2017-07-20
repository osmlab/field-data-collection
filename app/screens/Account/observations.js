import React, { Component } from "react";
import { StyleSheet, View, ListView, TouchableOpacity } from "react-native";
import Mapbox, { MapView } from "react-native-mapbox-gl";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";

import { syncData } from "../../actions";
import { Text, Wrapper, PercentComplete, Map } from "../../components";
import { baseStyles } from "../../styles";

class MyObservations extends Component {
  componentWillMount() {
    console.log("this.props.coordinatorTarget", this.props.coordinatorTarget);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.setState({
      observations: ds.cloneWithRows([
        {
          category: "Oil spill",
          surveyName: "Survey name",
          observationName: "Name of observation",
          updated: "Sep. 2, 2016",
          distance: "30cm away",
          complete: 0.7,
          coords: {
            latitude: 47.6685,
            longitude: -12.384
          }
        },
        {
          category: "Oil spill",
          surveyName: "Survey name",
          observationName: "Name of observation",
          updated: "Sep. 2, 2016",
          distance: "30cm away",
          complete: 0.7,
          coords: {
            latitude: 47.5685,
            longitude: -12.384
          }
        },
        {
          category: "Oil spill",
          surveyName: "Survey name",
          observationName: "Name of observation",
          updated: "Sep. 2, 2016",
          distance: "30cm away",
          complete: 0.7,
          coords: {
            latitude: 47.6685,
            longitude: -13.384
          }
        }
      ])
    });
  }

  onPressSync = () => {
    this.props.syncData(this.props.coordinatorTarget);
  };

  renderLastSynced = () => {
    const styles = [
      baseStyles.wrappedItems,
      baseStyles.wrappedItemsLeft,
      baseStyles.syncHeaderText
    ];

    if (this.props.observationsLastSynced) {
      return (
        <View style={styles}>
          <Text>Last Synced: </Text>
          <Text>
            {this.props.observationsLastSynced}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles}>
          <Text>Never Synced</Text>
        </View>
      );
    }
  };

  render() {
    const { history } = this.props;

    const headerView = (
      <View style={[baseStyles.mainHeader]}>
        <TouchableOpacity onPress={history.goBack}>
          <Icon
            name="keyboard-backspace"
            style={[[baseStyles.headerBackIcon]]}
          />
        </TouchableOpacity>

        <Text style={[baseStyles.h3, baseStyles.headerTitle]}>
          My Observations
        </Text>
      </View>
    );

    return (
      <Wrapper style={[baseStyles.mainHeaderSpace]} headerView={headerView}>
        <View style={[baseStyles.wrapperContentSm]}>
          <View style={[baseStyles.wrappedItems, baseStyles.syncHeader]}>
            {this.renderLastSynced()}

            <TouchableOpacity
              style={[baseStyles.buttonContent]}
              onPress={this.onPressSync}
            >
              <Text style={[baseStyles.textWhite]}>Sync Data</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ListView
          style={[baseStyles.listView]}
          dataSource={this.state.observations}
          noScroll={true}
          renderRow={item => {
            const complete = item.complete * 10;
            const incomplete = 10 - complete;
            const percentage = complete + "0%";

            return (
              <View style={[baseStyles.wrapperContent]}>
                <TouchableOpacity
                  style={[baseStyles.surveyCard]}
                  onPress={() => {
                    //TODO Link
                  }}
                >
                  <Map center={item.coords} zoom={12} />

                  <PercentComplete
                    radius={35}
                    complete={complete}
                    incomplete={incomplete}
                  >
                    <Text style={[baseStyles.percentCompleteTextSm]}>
                      <Text style={[baseStyles.percentCompleteTextNumSm]}>
                        {percentage}
                      </Text>
                    </Text>
                  </PercentComplete>

                  <View style={[baseStyles.surveyCardContent]}>
                    <Text
                      style={[baseStyles.h3, baseStyles.headerWithDescription]}
                    >
                      {item.observationName}
                    </Text>
                    <View style={[baseStyles.spaceBelow]}>
                      <View
                        style={[baseStyles.wrappedItems, baseStyles.spacer]}
                      >
                        <Text style={[baseStyles.withPipe]}>
                          {item.distance} |
                        </Text>
                        <Text>
                          Updated: {item.updated}
                        </Text>
                      </View>
                      <Text>
                        {item.surveyName}
                      </Text>
                    </View>
                    <Text>
                      {item.category}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  console.log("mapStateToProps state.coordinator", state.coordinator);
  return {
    observationsLastSynced: state.coordinator.observationsLastSynced,
    coordinatorTarget: state.coordinator.coordinatorTarget
  };
};

export default connect(mapStateToProps, { syncData })(MyObservations);
