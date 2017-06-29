import React, { Component } from "react";
import { TouchableOpacity, View } from "react-native";
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Text, Wrapper } from "../../components";
import { selectAvailableSurveys } from "../../selectors";
import { baseStyles } from "../../styles";
import LocalSurveyList from "./LocalSurveyList";

class SurveysScreen extends Component {
  onBackPress = () => this.props.navigation.dispatch(NavigationActions.back());

  render() {
    const { availableSurveys, navigation } = this.props;

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
        <LocalSurveyList navigation={navigation} surveys={availableSurveys} />

        {/* TODO this covers up part of a listed survey */}
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
  availableSurveys: selectAvailableSurveys(state)
});

export default connect(mapStateToProps)(SurveysScreen);
