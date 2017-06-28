import React, { Component } from "react";
import { StyleSheet, View, ListView, TouchableOpacity } from "react-native";
import { NavigationActions } from "react-navigation";
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
    const { navigate } = this.props.navigation;

    const onBackPress = () => {
      const backAction = NavigationActions.back();
      this.props.navigation.dispatch(backAction);
    };

    const headerView = (
      <View style={[baseStyles.mainHeader]}>
        <TouchableOpacity onPress={onBackPress}>
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
      <Wrapper
        style={[baseStyles.mainHeaderSpace]}
        navigation={this.props.navigation}
        headerView={headerView}
      >
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
                navigate("");
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
            return (
              <View style={[baseStyles.wrapperContent]}>
                <TouchableOpacity
                  style={[baseStyles.surveyCard]}
                  onPress={() => {
                    navigate("");
                  }}
                >
                  <View style={[baseStyles.map]}><Text>Map</Text></View>

                  <PercentComplete radius={35} complete={5} incomplete={4}>
                    <Text style={[baseStyles.percentCompleteTextSm]}>
                      <Text style={[baseStyles.percentCompleteTextNumSm]}>
                        80%
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
                        <Text>Updated: {item.updated}</Text>
                      </View>
                      <Text>{item.surveyName}</Text>
                    </View>
                    <Text>{item.category}</Text>
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
