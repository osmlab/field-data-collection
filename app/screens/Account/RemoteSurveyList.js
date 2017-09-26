import React, { Component } from "react";
import {
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  TextInput
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Text } from "../../components";
import { baseStyles } from "../../styles";

const Screen = Dimensions.get("window");

export default class RemoteSurveyList extends Component {
  isAvailable = survey => {
    const { availableSurveys } = this.props;

    // TODO: check version of survey
    return !!availableSurveys.find(s => s.definition.name === survey.name);
  };

  onAddressInput = address => {
    this.setState({ address });
  };

  onAddressSubmit = e => {
    this.props.listRemoteSurveys(this.state.address);
  };

  componentWillMount() {
    this.setState({
      address: "http://10.0.2.2:3210"
    });
  }

  render() {
    const { fetch, surveys, sync, close, fetchingListFailed } = this.props;

    if (fetchingListFailed) {
      return (
        <View style={baseStyles.wrapperContentMdInterior}>
          <Text style={baseStyles.h3}>Connect Manually</Text>
          <Text>Enter the full address of the Observe desktop app</Text>
          <TextInput
            ref={view => (this.addressInput = view)}
            onSubmitEditing={this.onAddressSubmit}
            onChangeText={this.onAddressInput}
            value={this.state.address}
            underlineColorAndroid="#ccc"
            autoFocus
          />
          <TouchableOpacity
            onPress={this.onAddressSubmit}
            style={baseStyles.buttonContent}
          >
            <Text style={{ color: "white" }}>Get survey list</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (surveys == null || surveys.length === 0) {
      return (
        <View style={baseStyles.wrapperContentMdInterior}>
          <ActivityIndicator
            style={{ marginTop: 50, marginBottom: 20 }}
            animating
            size="large"
          />
          <Text style={{ textAlign: "center" }}>Loading surveys</Text>
        </View>
      );
    }

    return (
      <View style={[baseStyles.wrapper]}>
        <ScrollView
          style={{
            flex: 1,
            flexDirection: "column",
            height: Screen.height - 85
          }}
        >
          {surveys.map((survey, idx) => {
            const available = this.isAvailable(survey);

            return (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  if (available) return;

                  fetch(survey.id, survey.url);
                  sync(survey.target);
                }}
                style={[baseStyles.touchableLinksWrapper, baseStyles.listBlock]}
              >
                <Text style={baseStyles.touchableLinks}>
                  {survey.name} {survey.version}
                </Text>

                {available &&
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      flexDirection: "row",
                      marginTop: 5
                    }}
                  >
                    <Icon
                      name="check"
                      size={14}
                      style={{ color: "#575456", marginTop: 3 }}
                    />
                    <Text
                      style={{
                        color: "#ccc",
                        fontSize: 16,
                        fontWeight: "bold"
                      }}
                    >
                      Synced
                    </Text>
                  </View>}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View
          style={{
            position: "absolute",
            bottom: 0,
            flexDirection: "row"
          }}
        >
          <TouchableOpacity
            onPress={close}
            style={[baseStyles.buttonBottom, { width: Screen.width - 40 }]}
          >
            <Text style={baseStyles.textWhite}>ADD SURVEYS</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
