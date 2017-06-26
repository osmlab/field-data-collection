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
