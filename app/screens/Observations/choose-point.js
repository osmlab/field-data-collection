import React, { Component } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import Mapbox, { MapView } from "react-native-mapbox-gl";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";

import { initializeObservation } from "../../actions";
import { selectActiveObservation } from "../../selectors";
import { Text, Wrapper, Map } from "../../components";
import { baseStyles } from "../../styles";

const styles = StyleSheet.create({
  map: {
    flex: 1
  }
});

class ChoosePoint extends Component {
  componentWillMount() {
    //   const { navigation: { state: { params: { fieldset } } } } = this.props;
    //
    //   this.setState({
    //     fieldset
    //   });
  }

  render() {
    const { history } = this.props;

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

        <Text style={[baseStyles.h3, baseStyles.headerTitle]}>Add</Text>
      </View>
    );

    return (
      <Wrapper headerView={headerView}>
        <View style={[baseStyles.wrapperContent]}>
          <Text style={baseStyles.title}>
            What are you adding an observation to?
          </Text>

          <Map zoom={12} />
        </View>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  // const { match: { params: { surveyId, type } } } = ownProps;

  return {
    observation: selectActiveObservation(state)
  };
};

export default connect(mapStateToProps, { initializeObservation })(ChoosePoint);
