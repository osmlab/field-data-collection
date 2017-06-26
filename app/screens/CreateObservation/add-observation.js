import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableHighlight,
  TouchableOpacity
} from "react-native";
import Mapbox, { MapView } from "react-native-mapbox-gl";
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Text, Wrapper, PercentComplete } from "../../components";
import { getFieldType } from "../../components/fields";
import { baseStyles } from "../../styles";
import PieChart from "react-native-pie-chart";

const styles = StyleSheet.create({});

class AddObservationScreen extends Component {
  onBackPress = () => this.props.navigation.dispatch(NavigationActions.back());

  renderField(field, index) {
    const { navigate } = this.props.navigation;
    const { type: { fields, name } } = this.props;

    const Field = getFieldType(field.type);

    return (
      <TouchableHighlight
        key={index}
        onPress={() =>
          navigate("FieldsetForm", {
            fieldset: { title: name, index, fields }
          })}
      >
        <Field {...field} />
      </TouchableHighlight>
    );
  }

  addLocation() {
    const { navigate } = this.props.navigation;
    navigate("Location");
  }

  render() {
    const { type: { fields, name } } = this.props;

    const onBackPress = () => {
      const backAction = NavigationActions.back();
      this.props.navigation.dispatch(backAction);
    };

    const headerView = (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center"
        }}
      >
        <TouchableOpacity onPress={onBackPress}>
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
      <Wrapper navigation={this.props.navigation} headerView={headerView}>
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
          <View style={{ flex: 0.25, position: "relative" }}>
            <PieChart
              chart_wh={100}
              series={[80]}
              sliceColor={["#1DE9B6"]}
              doughnut={true}
              coverRadius={0.85}
              coverFill={"#6579FC"}
            />
            <Text
              style={[
                baseStyles.percentCompleteText,
                baseStyles.textWhite,
                { position: "absolute", marginTop: 5, paddingLeft: 5 }
              ]}
            >
              <Text
                style={[
                  baseStyles.percentCompleteTextNum,
                  baseStyles.textWhite
                ]}
              >
                80%
              </Text>{" "}
              Complete
            </Text>
          </View>
        </View>
        <View style={[baseStyles.mapLg]}>
          <Text>Map</Text>
          <View style={[baseStyles.mapEditorBlock]}>
            <TouchableOpacity onPress={this.addLocation.bind(this)}>
              <Text style={[baseStyles.link]}>
                {"+ Add Location".toUpperCase()}
              </Text>
            </TouchableOpacity>
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
  const survey = state.surveys[0];

  const { navigation: { state: { params: { observationType } } } } = ownProps;

  const type = survey.featureTypes.find(x => x.id === observationType);

  return {
    type
  };
};

export default connect(mapStateToProps)(AddObservationScreen);
