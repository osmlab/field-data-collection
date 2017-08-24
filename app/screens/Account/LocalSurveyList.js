import React, { Component } from "react";
import { View, Alert } from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";

import { deleteLocalSurvey } from "../../actions";
import { Text } from "../../components";
import { baseStyles } from "../../styles";

class LocalSurveyList extends Component {
  render() {
    const { surveys, deleteLocalSurvey } = this.props;

    if (surveys == null || surveys.length === 0) {
      return null;
    }

    return (
      <View style={{}}>
        {surveys.map((survey, idx) =>
          <View
            key={idx}
            style={[
              baseStyles.wrapperContent,
              baseStyles.wrapperContentLg,
              baseStyles.listBlock,
              {
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between"
              }
            ]}
          >
            <Text style={[baseStyles.h3, baseStyles.headerWithDescription]}>
              {survey.definition.name}
            </Text>

            <Icon
              name="delete"
              style={[[baseStyles.headerBackIcon]]}
              onPress={() => {
                Alert.alert(
                  `Delete ${survey.definition.name}?`,
                  "This will remove the survey from your phone, but not your observations",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel"
                    },
                    {
                      text: "Delete survey",
                      onPress: () => deleteLocalSurvey(survey.definition.id)
                    }
                  ]
                );
              }}
            />
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps, { deleteLocalSurvey })(LocalSurveyList);
