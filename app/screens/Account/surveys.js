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
      navigation,
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
      <Wrapper navigation={navigation} headerView={headerView}>
        <StatusBar />

        <Button onPress={listRemoteSurveys} title="Refresh Survey List" />
        <RemoteSurveyList fetch={fetchRemoteSurvey} surveys={remoteSurveys} />

        {/* TODO blank slate state when no surveys are available */}
        <LocalSurveyList navigation={navigation} surveys={availableSurveys} />

        {/* TODO this should display on the bottom */}
        {/* <TouchableOpacity style={baseStyles.buttonBottom}>
          <Text style={[baseStyles.textWhite]}>
            {"Add New Surveys".toUpperCase()}
          </Text>
        </TouchableOpacity> */}
        <View style={{ flex: 0.75, justifyContent: "space-between" }}>
          <View
            style={[
              baseStyles.wrapperContent,
              baseStyles.wrapperContentLg,
              baseStyles.listBlock
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

        </View>
        <View style={{ position: "relative" }}>
          <TouchableOpacity
            style={[baseStyles.buttonBottom, { alignSelf: "flex-end" }]}
            onPress={() => {
              navigate("SurveyChoose");
            }}
          >
            <Text style={[baseStyles.textWhite]}>
              {"Add New Surveys".toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>
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
