import React, { Component } from "react";
import { TouchableOpacity, View, Dimensions } from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Link } from "react-router-native";

import { clearLocalSurveys } from "../../actions";
import { Text, Wrapper } from "../../components";
import { selectAvailableSurveys } from "../../selectors";
import { baseStyles } from "../../styles";
import LocalSurveyList from "./LocalSurveyList";
import SurveyModal from "./SurveyModal";

const Screen = Dimensions.get("window");

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
        <Link to="/">
          <Icon
            name="keyboard-backspace"
            style={[[baseStyles.headerBackIcon]]}
          />
        </Link>
        <Text style={[baseStyles.h3, baseStyles.headerTitle]}>Surveys</Text>
      </View>
    );

    return (
      <Wrapper headerView={headerView} style={{ height: Screen.height }}>
        {showModal && <SurveyModal close={this.hideModal} />}

        <LocalSurveyList surveys={availableSurveys} />

        <View style={{ height: Screen.height }}>
          <TouchableOpacity
            style={[baseStyles.buttonBottom]}
            onPress={this.showModal}
          >
            <Text style={[baseStyles.textWhite]}>ADD NEW SURVEY</Text>
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
