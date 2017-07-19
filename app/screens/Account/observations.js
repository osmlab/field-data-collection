import React, { Component } from "react";
import { StyleSheet, View, ListView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Text, Wrapper, PercentComplete } from "../../components";
import { baseStyles } from "../../styles";

class AccountScreen extends Component {
  componentWillMount() {
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
          complete: 0.7
        },
        {
          category: "Oil spill",
          surveyName: "Survey name",
          observationName: "Name of observation",
          updated: "Sep. 2, 2016",
          distance: "30cm away",
          complete: 0.7
        },
        {
          category: "Oil spill",
          surveyName: "Survey name",
          observationName: "Name of observation",
          updated: "Sep. 2, 2016",
          distance: "30cm away",
          complete: 0.7
        }
      ])
    });
  }

  render() {
    const { history } = this.props;

    const headerView = (
      <View style={[baseStyles.mainHeader]}>
        <TouchableOpacity
          onPress={() => {
            history.goBack();
          }}
        >
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
            <View
              style={[
                baseStyles.wrappedItems,
                baseStyles.wrappedItemsLeft,
                baseStyles.syncHeaderText
              ]}
            >
              <Text>Last Synced: </Text>
              <Text>Aug 14, 2016</Text>
            </View>
            <TouchableOpacity
              style={[baseStyles.buttonContent]}
              onPress={() => {
                //TODO Link
              }}
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
                  <View style={[baseStyles.map]}>
                    <Text>Map</Text>
                  </View>

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

export default AccountScreen;
