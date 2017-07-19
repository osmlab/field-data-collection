import React, { Component } from "react";
import { TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";

import { clearLocalSurveys } from "../../actions";
import { Text, Wrapper } from "../../components";
import { selectAvailableSurveys } from "../../selectors";
import { baseStyles } from "../../styles";
import LocalSurveyList from "./LocalSurveyList";
import SurveyModal from "./SurveyModal";

class SurveysScreen extends Component {
  state = {
    showModal: false
  };

  hideModal = () =>
    this.setState({
      showModal: false
    });

  showModal = () =>
    this.setState({
      showModal: true
    });

  // uncomment this to clear local surveys when displaying this screen
  // componentWillMount() {
  //   this.props.clearLocalSurveys();
  // }

  render() {
    const { availableSurveys, history } = this.props;
    const { showModal } = this.state;

    const headerView = (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center"
        }}
      >
        <TouchableOpacity onPress={history.goBack}>
          <Icon
            name="keyboard-backspace"
            style={[[baseStyles.headerBackIcon]]}
          />
        </TouchableOpacity>
        <Text style={[baseStyles.h3, baseStyles.headerTitle]}>Surveys</Text>
      </View>
    );

    return (
      <Wrapper headerView={headerView}>
        {showModal && <SurveyModal close={this.hideModal} />}

        <LocalSurveyList surveys={availableSurveys} />

        <View style={{ flex: 1, alignItems: "stretch" }}>
          <TouchableOpacity
            style={[baseStyles.buttonBottom]}
            onPress={this.showModal}
          >
            <Text style={[baseStyles.textWhite]}>ADD NEW SURVEYS</Text>
          </TouchableOpacity>
        </View>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  availableSurveys: selectAvailableSurveys(state)
});

export default connect(mapStateToProps, { clearLocalSurveys })(SurveysScreen);
