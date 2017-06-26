import React, { Component } from "react";
import { StyleSheet, View, ListView, TouchableHighlight } from "react-native";
import { connect } from "react-redux";
import { NavigationActions } from "react-navigation";

import { Text, Wrapper } from "../../components";
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
  componentWillMount() {
    const { observationTypes } = this.props;

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.setState({
      categories: ds.cloneWithRows(
        observationTypes.map(t => ({
          id: t.id,
          name: t.name
        }))
      )
    });
  }

  render() {
    const { navigate } = this.props.navigation;

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
        <Text style={[baseStyles.headerBackIcon]} onPress={onBackPress}>
          ←
        </Text>
        <Text style={[baseStyles.h3, baseStyles.headerTitle]}>
          Add Observation
        </Text>
      </View>
    );

    return (
      <Wrapper navigation={this.props.navigation} headerView={headerView}>
        <View style={[baseStyles.wrapperContent]}>
          <Text style={baseStyles.title}>
            What do you want to add?
          </Text>

          <ListView
            contentContainerStyle={styles.gridContainer}
            dataSource={this.state.categories}
            noScroll={true}
            renderRow={item => {
              function onCategoryPress() {
                navigate("AddObservation", { observationType: item.id });
              }

              return (
                <TouchableHighlight onPress={onCategoryPress}>
                  <View style={styles.gridItem}>
                    <Text>{item.name}</Text>
                  </View>
                </TouchableHighlight>
              );
            }}
          />

          <View style={styles.moreItemsButton}>
            <Text style={{}} onPress={() => {}}>View More</Text>
          </View>
        </View>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  observationTypes: selectObservationTypes(state)
});

export default connect(mapStateToProps)(CategoriesScreen);
