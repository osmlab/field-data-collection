import React, { Component } from "react";
import { View, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";

import {
  updateObservation,
  saveObservation,
  setActiveObservation
} from "../../actions";
import { Text, Wrapper, getFieldInput } from "../../components";
import { selectActiveObservation, selectFeatureType } from "../../selectors";
import { baseStyles } from "../../styles";

const screen = Dimensions.get("window");

class FieldsetFormScreen extends Component {
  componentWillMount() {
    this.setState({
      observation: Object.assign({}, this.props.observation)
    });
  }

  renderField(field, index) {
    const { observation, updateObservation } = this.props;

    try {
      const Field = getFieldInput(field.type);
      return (
        <Field
          field={field}
          key={index}
          observation={observation}
          updateObservation={updateObservation}
        />
      );
    } catch (err) {
      console.warn(err);

      return null;
    }
  }

  render() {
    const {
      saveObservation,
      setActiveObservation,
      history,
      type: { fields, name }
    } = this.props;

    return (
      <View style={[baseStyles.modalBg]}>
        <View style={[baseStyles.modal]}>
          <View
            style={[baseStyles.wrapperContentMdHeader, baseStyles.wrappedItems]}
          >
            <Text style={[baseStyles.h3, baseStyles.wrappedItemsLeft]}>
              Basic Information
            </Text>

            <TouchableOpacity
              onPress={() => {
                if (fields && fields.length > 0) {
                  fields.forEach(({ key }) => {
                    if (this.state.observation.tags[key]) {
                      delete this.state.observation.tags[key];
                    }
                  });
                }

                setActiveObservation(this.state.observation);
                history.goBack();
              }}
            >
              <Icon name="clear" style={[[baseStyles.clearIcon]]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={[baseStyles.fieldset, { marginBottom: 60 }]}>
            {fields.map(this.renderField, this)}
          </ScrollView>

          <View
            style={{
              position: "absolute",
              bottom: 0,
              flexDirection: "row"
            }}
          >
            <TouchableOpacity
              style={[baseStyles.buttonBottom, { width: screen.width }]}
              onPress={() => {
                saveObservation(this.props.observation);
                history.goBack();
              }}
            >
              <Text style={baseStyles.textWhite}>SAVE OBSERVATION</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { match: { params: { surveyId, type } } } = ownProps;

  const featureType = selectFeatureType(type, state);

  return {
    observation: selectActiveObservation(state),
    surveyId,
    type: featureType
  };
};

export default connect(mapStateToProps, {
  updateObservation,
  saveObservation,
  setActiveObservation
})(FieldsetFormScreen);
