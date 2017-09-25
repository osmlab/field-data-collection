import React, { Component } from "react";
import { TouchableOpacity, View, Dimensions, ScrollView } from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Link } from "react-router-native";

import { clearLocalSurveys } from "../../actions";
import { Text, Wrapper } from "../../components";
import { selectSurveysWithActivity } from "../../selectors";
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

  componentWillMount() {
    const { availableSurveys } = this.props;
    console.log(availableSurveys);
    if (!availableSurveys.length) this.showModal();
  }

  render() {
    const { availableSurveys } = this.props;
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
      <Wrapper style={[baseStyles.wrapper]} headerView={headerView}>
        <ScrollView
          headerView={headerView}
          style={{
            flex: 1,
            flexDirection: "column",
            height: Screen.height - 85
          }}
          hideStatusBar
        >
          <Text style={[baseStyles.wrapperContent]}>
            Choose a survey you'd like to add observations to. Please note, at
            leaset one survey has to be active at any time.
          </Text>
          {showModal && <SurveyModal close={this.hideModal} />}
          <LocalSurveyList surveys={availableSurveys} />
        </ScrollView>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            flexDirection: "row"
          }}
        >
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
  availableSurveys: selectSurveysWithActivity(state)
});

export default connect(mapStateToProps, { clearLocalSurveys })(SurveysScreen);
