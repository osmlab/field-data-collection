import React, { Component } from "react";
import { View, ListView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import { format } from "date-fns";
import { Link } from "react-router-native";

import { compareDesc } from "date-fns";

import {
  pickSurveyType,
  calculateCompleteness
} from "../../lib/calculate-completeness";

import { syncData, setActiveObservation, osm } from "../../actions";
import { selectFeatureTypes } from "../../selectors";
import {
  Text,
  Wrapper,
  PercentComplete,
  Map,
  AnnotationObservation
} from "../../components";
import { baseStyles } from "../../styles";

class AccountObservations extends Component {
  componentWillMount() {
    const { deviceId, types } = this.props;

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.setState({ observations: ds.cloneWithRows([]) });

    osm.getObservationsByDeviceId(deviceId, (err, results) => {
      let resultsWithCompleteness = results.map(result => {
        let survey = pickSurveyType(types, result);
        let percentage = calculateCompleteness(survey, result);
        result.percentage = percentage;
        return result;
      });

      resultsWithCompleteness.sort((a, b) =>
        compareDesc(a.timestamp, b.timestamp)
      );

      this.setState({
        observations: ds.cloneWithRows(resultsWithCompleteness)
      });
    });
  }

  onPressSync = () => {
    this.props.syncData(this.props.coordinatorTarget);
  };

  renderLastSynced = () => {
    const styles = [baseStyles.syncHeaderText];

    if (this.props.observationsLastSynced) {
      return (
        <View style={styles}>
          <Text style={{ fontSize: 13 }}>Last Synced: </Text>
          <Text style={{ fontSize: 13 }}>
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
    const { history, setActiveObservation } = this.props;

    const headerView = (
      <View style={[baseStyles.mainHeader]}>
        <Link to="/">
          <Icon
            name="keyboard-backspace"
            style={[[baseStyles.headerBackIcon]]}
          />
        </Link>

        <Text style={[baseStyles.h3, baseStyles.headerTitle]}>
          My Observations
        </Text>
      </View>
    );

    const { observations } = this.state;

    return (
      <Wrapper headerView={headerView}>
        <View style={[baseStyles.wrapperContentSm, { marginBottom: 20 }]}>
          <View>
            <Text style={[baseStyles.spaceBelow]}>
              Sync new updates from the Observe Coordinator and push your
              updates to midigate data loss.
            </Text>
            <View style={[baseStyles.buttonContentWrapper]}>
              <TouchableOpacity
                style={[baseStyles.buttonContent]}
                onPress={this.onPressSync}
              >
                <Text style={[baseStyles.textWhite]}>Sync Data</Text>
              </TouchableOpacity>
            </View>
            {this.renderLastSynced()}
          </View>
        </View>

        <ListView
          style={[baseStyles.listView]}
          dataSource={observations}
          noScroll={true}
          renderRow={item => {
            // TODO: calculate based on number of tags in survey
            const percentage = item.percentage + "%";
            const complete = parseInt(item.percentage / 10, 10);
            const incomplete = 10 - complete;

            return (
              <View style={[baseStyles.wrapperContent]}>
                <TouchableOpacity
                  style={[baseStyles.surveyCard]}
                  onPress={() => {
                    setActiveObservation(item);

                    history.push({
                      pathname: `/observation/${item.tags.surveyId}/${item.tags
                        .surveyType}`
                    });
                  }}
                >
                  <View>
                    <Map
                      center={{ latitude: item.lat, longitude: item.lon }}
                      zoom={16}
                    >
                      <AnnotationObservation
                        id={item.id}
                        owner={item.tags.deviceId}
                        coordinates={{
                          latitude: item.lat,
                          longitude: item.lon
                        }}
                      />
                    </Map>

                    {
                      <View
                        style={[
                          baseStyles.percentCompleteWrapper,
                          { marginTop: 60 }
                        ]}
                      >
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
                      </View>
                    }

                    <View style={[baseStyles.surveyCardContent]}>
                      <Text style={[baseStyles.h3, baseStyles.headerLink]}>
                        Observation
                      </Text>
                      <View style={[baseStyles.spaceBelow]}>
                        <View
                          style={[baseStyles.wrappedItems, { marginBottom: 5 }]}
                        >
                          <Text>
                            Survey: {item.tags.surveyId}
                          </Text>
                        </View>
                        <View style={[baseStyles.wrappedItems]}>
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
    types: selectFeatureTypes(state),
    observationsLastSynced: state.coordinator.observationsLastSynced,
    coordinatorTarget: state.coordinator.coordinatorTarget,
    deviceId: state.user.deviceId
  };
};

export default connect(mapStateToProps, { syncData, setActiveObservation })(
  AccountObservations
);
