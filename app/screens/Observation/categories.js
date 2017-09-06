import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Text, Wrapper, CategoryList } from "../../components";
import { selectAllCategories, selectActiveObservation } from "../../selectors";
import { baseStyles } from "../../styles";

class CategoriesScreen extends Component {
  render() {
    const { categories, history, observation } = this.props;

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
        <View style={[baseStyles.wrapperContentHeader, baseStyles.headerPage]}>
          <View style={[baseStyles.headerPageText]}>
            <Text
              style={[
                baseStyles.h2,
                baseStyles.textWhite,
                baseStyles.headerWithDescription
              ]}
            >
              What do you want to add?
            </Text>
          </View>
        </View>

        <CategoryList categories={categories} />
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  categories: selectAllCategories(state),
  observation: selectActiveObservation(state)
});

export default connect(mapStateToProps)(CategoriesScreen);
