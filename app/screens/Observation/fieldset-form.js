import React, { Component } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";

import { updateObservation } from "../../actions";
import { Text, Wrapper, getFieldInput } from "../../components";
import { selectActiveObservation, selectFeatureType } from "../../selectors";
import { baseStyles } from "../../styles";

class FieldsetFormScreen extends Component {
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
    const { history, type: { fields, name } } = this.props;

    return (
      <View style={[baseStyles.modalBg]}>
        <View style={[baseStyles.modal]}>
          <View
            style={[baseStyles.wrapperContentMdHeader, baseStyles.wrappedItems]}
          >
            <Text style={[baseStyles.h3, baseStyles.wrappedItemsLeft]}>
              Basic Information
            </Text>

            <TouchableOpacity onPress={history.goBack}>
              <Icon name="clear" style={[[baseStyles.clearIcon]]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={[baseStyles.fieldset]}>
            {fields.map(this.renderField, this)}
          </ScrollView>
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

export default connect(mapStateToProps, { updateObservation })(
  FieldsetFormScreen
);
