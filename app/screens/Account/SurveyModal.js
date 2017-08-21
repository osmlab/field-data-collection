import React, { Component } from "react";
import { View, TouchableOpacity, Modal } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";

import {
  clearRemoteSurveys,
  fetchRemoteSurvey,
  listRemoteSurveys,
  syncData,
  destroyAllData
} from "../../actions";
import { StatusBar, Text } from "../../components";
import RemoteSurveyList from "./RemoteSurveyList";
import { selectRemoteSurveys } from "../../selectors";
import { baseStyles } from "../../styles";

class SurveyModal extends Component {
  componentWillMount() {
    this.props.clearRemoteSurveys();
    this.props.listRemoteSurveys();
  }

  render() {
    const { close, fetchRemoteSurvey, remoteSurveys, syncData } = this.props;

    return (
      <Modal animationType="slide" transparent visible onRequestClose={close}>
        <View style={[baseStyles.wrapperContentMd, baseStyles.modal]}>
          <View style={[baseStyles.wrappedItems]}>
            <Text style={[baseStyles.h2, baseStyles.wrappedItemsLeft]}>
              Add Survey
            </Text>

            <TouchableOpacity onPress={close}>
              <Icon name="clear" style={[[baseStyles.clearIcon]]} />
            </TouchableOpacity>
          </View>

          <RemoteSurveyList
            fetch={fetchRemoteSurvey}
            sync={syncData}
            surveys={remoteSurveys}
            close={close}
          />
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  remoteSurveys: selectRemoteSurveys(state)
});

export default connect(mapStateToProps, {
  clearRemoteSurveys,
  fetchRemoteSurvey,
  listRemoteSurveys,
  syncData,
  destroyAllData
})(SurveyModal);
