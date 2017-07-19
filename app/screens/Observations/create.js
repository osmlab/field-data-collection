import React, { Component } from "react";
import {
  Image,
  View,
  TouchableHighlight,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Link } from "react-router-native";

import { Text, Wrapper, PercentComplete, Map } from "../../components";
import { getFieldType } from "../../components/fields";
import { selectFeatureType, selectIcon } from "../../selectors";
import { baseStyles } from "../../styles";

class AddObservationScreen extends Component {
  renderField(field, index) {
    const { type: { fields, name } } = this.props;

    try {
      const Field = getFieldType(field.type);

      return (
        <Link
          key={index}
          to="/add-observation/fields"
          fieldset={{ title: name, index, fields }}
        >
          <Field {...field} />
        </Link>
      );
    } catch (err) {
      console.warn(err);

      return null;
    }
  }

  render() {
    const { icon, history, type: { fields, name } } = this.props;

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
        <Text style={[baseStyles.h3, baseStyles.headerTitle]}>
          Add Observation
        </Text>
      </View>
    );

    return (
      <Wrapper headerView={headerView}>
        <View
          style={[
            baseStyles.wrapperContentHeader,
            baseStyles.headerPage,
            { flexWrap: "wrap", flex: 1, flexDirection: "row" }
          ]}
        >
          <View style={[baseStyles.headerPageText]}>
            <Text
              style={[
                baseStyles.h2,
                baseStyles.textWhite,
                baseStyles.headerWithDescription
              ]}
            >
              {name}
            </Text>
            <Image
              source={{ uri: icon.src }}
              style={{
                width: 100,
                height: 50,
                resizeMode: Image.resizeMode.contain
              }}
            />
            <Text>
              <Text style={[baseStyles.textWhite]}>Adding point to: </Text>
              <Text
                style={[
                  baseStyles.textWhite,
                  { paddingLeft: 5, paddingRight: 5 }
                ]}
              >
                Survey 1
              </Text>
            </Text>
          </View>
        </View>
        <View style={[baseStyles.mapLg]}>
          <Map />

          <View style={[baseStyles.mapEditorBlock]}>
            <Link to="/add-observation/location">
              <Text style={[baseStyles.link]}>+ ADD LOCATION</Text>
            </Link>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <View style={[baseStyles.wrapperContent]}>
            <Text style={[baseStyles.h3]}>Basic Info</Text>

            <View style={baseStyles.fieldset}>
              {fields.map(this.renderField, this)}
            </View>
          </View>
        </View>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { match: { params: { type } } } = ownProps;

  const featureType = selectFeatureType(type, state);

  return {
    icon: selectIcon(featureType.icon, state),
    type: featureType
  };
};

export default connect(mapStateToProps)(AddObservationScreen);
