import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Text, Wrapper, CategoryList } from "../../components";
import { selectAllCategories } from "../../selectors";
import { baseStyles } from "../../styles";

class CategoriesScreen extends Component {
  onBackPress = () => this.props.navigation.dispatch(NavigationActions.back());

  render() {
    const { categories, navigation } = this.props;

    const headerView = (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center"
        }}
      >
        <TouchableOpacity onPress={this.onBackPress}>
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
      <Wrapper navigation={navigation} headerView={headerView}>
        <View style={[baseStyles.wrapperContent]}>
          <Text style={baseStyles.title}>What do you want to add?</Text>

          <CategoryList navigation={navigation} categories={categories} />
        </View>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  categories: selectAllCategories(state)
});

export default connect(mapStateToProps)(CategoriesScreen);
