import React, { Component } from "react";
import { Button, TouchableOpacity, View } from "react-native";
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";

import {
  clearRemoteSurveys,
  fetchRemoteSurvey,
  listRemoteSurveys
} from "../../actions";
import { StatusBar, Text, Wrapper } from "../../components";
import { selectAvailableSurveys, selectRemoteSurveys } from "../../selectors";
import { baseStyles } from "../../styles";
import LocalSurveyList from "./LocalSurveyList";
import RemoteSurveyList from "./RemoteSurveyList";

class SurveysScreen extends Component {
  onBackPress = () => this.props.navigation.dispatch(NavigationActions.back());

  componentWillMount() {
    this.props.clearRemoteSurveys();
    this.props.listRemoteSurveys();
  }

  render() {
    const {
      availableSurveys,
      fetchRemoteSurvey,
      listRemoteSurveys,
      remoteSurveys
    } = this.props;

    const { navigate } = this.props.navigation;

    const headerView = (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center"
        }}
      >
        <TouchableOpacity onPress={this.onBackPress}>
          <Icon
            name="keyboard-backspace"
            style={[[baseStyles.headerBackIcon]]}
          />
        </TouchableOpacity>
        <Text style={[baseStyles.h3, baseStyles.headerTitle]}>Surveys</Text>
      </View>
    );

    return (
      <Wrapper navigation={this.props.navigation} headerView={headerView}>
        <StatusBar />

        <Button onPress={listRemoteSurveys} title="Refresh Survey List" />
        <RemoteSurveyList fetch={fetchRemoteSurvey} surveys={remoteSurveys} />
        <LocalSurveyList surveys={availableSurveys} />

        <View
          style={[
            baseStyles.wrapperContent,
            baseStyles.wrapperContentLg,
            baseStyles.listBlock,
            { flex: 1 }
          ]}
        >
          <Text style={[baseStyles.h3, baseStyles.headerWithDescription]}>
            OSM
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <Text>Updated: </Text>
            <Text>4/30/17 4:30</Text>
          </View>
          <View style={[baseStyles.observationBlock]}>
            <Text style={[baseStyles.metadataText]}>2 Observations</Text>
          </View>
        </View>
        <View
          style={[
            baseStyles.wrapperContent,
            baseStyles.wrapperContentLg,
            baseStyles.listBlock,
            { flex: 1 }
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              navigate("Survey");
            }}
          >
            <Text style={[baseStyles.h3, baseStyles.headerWithDescription]}>
              Survey Name
            </Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <Text>Updated: </Text>
            <Text>4/30/17 4:30pm</Text>
          </View>
          <View
            style={[
              baseStyles.observationBlock,
              baseStyles.spaceBelowMd,
              { flexDirection: "row", flexWrap: "wrap" }
            ]}
          >
            <Text style={[baseStyles.metadataText]}>2 Observations</Text>
            <Text style={[baseStyles.textAlert]}>(2 incomplete)</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigate("Survey");
            }}
          >
            <Text style={[baseStyles.link]}>{"Edit".toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[baseStyles.buttonBottom]}
          onPress={() => {
            navigate("SurveyChoose");
          }}
        >
          <Text style={[baseStyles.textWhite]}>
            {"Add New Surveys".toUpperCase()}
          </Text>
        </TouchableOpacity>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  availableSurveys: selectAvailableSurveys(state),
  remoteSurveys: selectRemoteSurveys(state)
});

export default connect(mapStateToProps, {
  clearRemoteSurveys,
  fetchRemoteSurvey,
  listRemoteSurveys
})(SurveysScreen);
