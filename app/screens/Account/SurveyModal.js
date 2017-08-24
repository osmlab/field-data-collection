import React, { Component } from "react";
import { View, TouchableOpacity, Modal, ActivityIndicator } from "react-native";
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
import { selectRemoteSurveys, selectActiveSurveys } from "../../selectors";
import { baseStyles } from "../../styles";

class SurveyModal extends Component {
  componentWillMount() {
    this.props.clearRemoteSurveys();
    this.props.listRemoteSurveys();
  }

  render() {
    const {
      close,
      fetchRemoteSurvey,
      remoteSurveys,
      activeSurveys,
      syncData,
      fetchingRemoteSurvey,
      remoteSurveyFetched,
      syncingSurveyData,
      surveyDataSynced
    } = this.props;

    const loadingSurvey = fetchingRemoteSurvey || syncingSurveyData;

    return (
      <Modal animationType="slide" transparent visible onRequestClose={close}>
        <View style={[baseStyles.modalBg]}>
          <View style={[baseStyles.modal]}>
            <View
              style={[
                baseStyles.wrapperContentMdHeader,
                baseStyles.wrappedItems
              ]}
            >
              <Text style={[baseStyles.h2, baseStyles.wrappedItemsLeft]}>
                Add Surveys
              </Text>

              <TouchableOpacity onPress={close}>
                <Icon name="clear" style={[[baseStyles.clearIcon]]} />
              </TouchableOpacity>
            </View>

            <RemoteSurveyList
              fetch={fetchRemoteSurvey}
              sync={syncData}
              surveys={remoteSurveys}
              activeSurveys={activeSurveys}
              close={close}
            />

            {loadingSurvey &&
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <View
                  style={
                    (
                      [baseStyles.wrapperContentMdInterior],
                      {
                        backgroundColor: "white",
                        elevation: 2,
                        padding: 40,
                        width: 200
                      }
                    )
                  }
                >
                  <ActivityIndicator animating size="large" />
                  <Text style={{ textAlign: "center" }}>Loading survey</Text>
                </View>
              </View>}
          </View>
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  fetchingRemoteSurvey: state.surveys.fetchingRemoteSurvey,
  remoteSurveys: selectRemoteSurveys(state),
  activeSurveys: selectActiveSurveys(state)
});

export default connect(mapStateToProps, {
  clearRemoteSurveys,
  fetchRemoteSurvey,
  listRemoteSurveys,
  syncData,
  destroyAllData
})(SurveyModal);
