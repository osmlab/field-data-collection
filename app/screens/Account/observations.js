import React, { Component } from "react";
import { StyleSheet, View, ListView, TouchableOpacity } from "react-native";
import Mapbox, { MapView } from "react-native-mapbox-gl";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import { format } from "date-fns";

import { syncData, getPeerInfo, osm } from "../../actions";
import { getObservationsByDeviceId } from "../../lib/observations";
import {
  Text,
  Wrapper,
  PercentComplete,
  Map,
  AnnotationObservation
} from "../../components";
import { baseStyles } from "../../styles";

class MyObservations extends Component {
  componentWillMount() {
    const { deviceId } = this.props;

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.setState({ observations: ds.cloneWithRows([]) });

    osm.getObservationsByDeviceId(deviceId, (err, results) => {
      this.setState({
        observations: ds.cloneWithRows(results)
      });
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
          <Text style={{ fontSize: 12 }}>Last Synced: </Text>
          <Text style={{ fontSize: 12 }}>
            {format(
              this.props.observationsLastSynced,
              "h:mm aa ddd, MMM D, YYYY"
            )}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles}>
          <Text style={{ fontSize: 12 }}>Never Synced</Text>
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

    const { observations } = this.state;

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
          dataSource={observations}
          noScroll={true}
          renderRow={item => {
            // TODO: calculate based on number of tags in survey
            const complete = (item.complete || 0) * 10;
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
                  <Map
                    center={{ latitude: item.lat, longitude: item.lon }}
                    zoom={16}
                  >
                    <AnnotationObservation
                      id={item.id}
                      coordinates={{ latitude: item.lat, longitude: item.lon }}
                    />
                  </Map>

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
                      Observation
                    </Text>
                    <View style={[baseStyles.spaceBelow]}>
                      <View
                        style={[baseStyles.wrappedItems, baseStyles.spacer]}
                      >
                        <Text style={[baseStyles.withPipe]}>
                          {item.distance} |
                        </Text>
                        <Text>
                          Updated:{" "}
                          {format(item.timestamp, "h:mm aa ddd, MMM D, YYYY")}
                        </Text>
                      </View>
                      <Text>
                        {item.surveyName}
                      </Text>
                    </View>
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
  return {
    observationsLastSynced: state.coordinator.observationsLastSynced,
    coordinatorTarget: state.coordinator.coordinatorTarget,
    deviceId: state.user.deviceId
  };
};

export default connect(mapStateToProps, { syncData })(MyObservations);
