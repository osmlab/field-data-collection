import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ListView,
  TouchableHighlight,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Text, Wrapper, CategoryList } from "../../components";
import { selectObservationTypes } from "../../selectors";
import { baseStyles } from "../../styles";

const styles = StyleSheet.create({
  gridContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    marginBottom: 50
  },
  gridItem: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    margin: 5,
    width: 80,
    height: 80
  },
  moreItemsButton: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginTop: 20
  }
});

class CategoriesScreen extends Component {
  render() {
    console.log("CategoriesScreen", this.props, this.navigation);
    const { navigation } = this.props;
    const navigate = navigation.navigate;

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
      <Wrapper navigation={navigation} headerView={headerView}>
        <View style={[baseStyles.wrapperContent]}>
          <Text style={baseStyles.title}>
            What do you want to add?
          </Text>

          {/* TODO: pull this from surveys in state */}
          <CategoryList
            navigation={navigation}
            categories={[
              {
                name: "OSM",
                list: [
                  { name: "Oil spills" },
                  { name: "Blast Fishing" },
                  { name: "Schools" },
                  { name: "Buildings" },
                  { name: "Hazards" },
                  { name: "Oil spills" },
                  { name: "Blast Fishing" },
                  { name: "Schools" },
                  { name: "Buildings" },
                  { name: "Hazards" }
                ]
              }
            ]}
          />
        </View>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  observationTypes: selectObservationTypes(state)
});

export default connect(mapStateToProps)(CategoriesScreen);
