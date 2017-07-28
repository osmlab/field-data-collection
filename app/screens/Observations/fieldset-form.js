import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";

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
      <Wrapper>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Text style={[baseStyles.title]}>
            {name}
          </Text>
          <Text style={{ fontSize: 25 }} onPress={history.goBack}>
            ⅹ
          </Text>
        </View>

        <View style={[baseStyles.fieldset]}>
          {fields.map(this.renderField, this)}
        </View>
      </Wrapper>
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
