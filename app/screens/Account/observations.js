import React, { Component } from "react";
import { StyleSheet, View, ListView } from "react-native";

import { Text, Wrapper } from "../../components";
import { baseStyles } from "../../styles";

const styles = StyleSheet.create({
  observation: {
    backgroundColor: "white",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 5
  },
  muted: {
    color: "#bbb"
  },
  observationTitle: {
    fontSize: 15,
    fontWeight: "bold"
  },
  content: {
    marginTop: 20
  },
  settingsButton: {
    position: "absolute",
    top: 20,
    right: 20
  },
  settingsButtonText: {
    fontSize: 15
  }
});

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
          lnglat: [47, -122],
          complete: 0.70
        },
        {
          category: "Oil spill",
          surveyName: "Survey name",
          observationName: "Name of observation",
          updated: "Sep. 2, 2016",
          lnglat: [47, -122],
          complete: 0.70
        },
        {
          category: "Oil spill",
          surveyName: "Survey name",
          observationName: "Name of observation",
          updated: "Sep. 2, 2016",
          lnglat: [47, -122],
          complete: 0.70
        }
      ])
    });
  }

  render() {
    const { navigate } = this.props.navigation;

    function onSettingsPress() {
      console.log("onSettingsPress");
      navigate("Settings");
    }

    return (
      <Wrapper>
        <Text style={baseStyles.title}>
          Your Observations
        </Text>

        <View style={styles.settingsButton}>
          <Text style={styles.settingsButtonText} onPress={onSettingsPress}>
            ⚙
          </Text>
        </View>

        <ListView
          contentContainerStyle={styles.content}
          dataSource={this.state.observations}
          noScroll={true}
          renderRow={item => {
            return (
              <View style={styles.observation}>
                <View />
                <Text style={styles.muted}>
                  {item.category} | {item.surveyName}
                </Text>
                <Text style={styles.observationTitle}>
                  {item.observationName}
                </Text>
                <Text style={styles.muted}>Last updated: {item.updated}</Text>
                <Text>Lat/Long: {item.lnglat}</Text>
              </View>
            );
          }}
        />
      </Wrapper>
    );
  }
}

export default AccountScreen;
