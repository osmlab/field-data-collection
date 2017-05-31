import React, { Component } from "react";
import { StyleSheet, View, Button, TouchableHighlight } from "react-native";
import { NavigationActions } from "react-navigation";

import { Text, Wrapper } from "../../components";
import { baseStyles } from "../../styles";

class AddObservationScreen extends Component {
  constructor(params) {
    super();

    this.state = {
      category: params.navigation.state.params.category
    };
  }

  onBackPress = () => this.props.navigation.dispatch(NavigationActions.back());

  render() {
    const { navigate } = this.props.navigation;
    const { category } = this.state;

    return (
      <Wrapper>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <Text
            style={{ fontSize: 30, marginTop: -10, marginRight: 5 }}
            onPress={this.onBackPress}
          >
            ←
          </Text>
          <Text style={[baseStyles.title]}>Adding: {category.name}</Text>
        </View>

        <View
          style={{
            marginTop: 20,
            marginBottom: 20,
            flexDirection: "row",
            flexWrap: "wrap"
          }}
        >
          <Text>
            <Text style={{}}>Adding point to: </Text>
            <Text style={{ paddingLeft: 5, paddingRight: 5 }}>Survey 1 </Text>
            <Text
              style={{
                textDecorationLine: "underline",
                textDecorationStyle: "solid",
                textDecorationColor: "#ccc"
              }}
            >
              edit
            </Text>
          </Text>
        </View>

        {/* TODO: map */}
        <View
          style={{
            height: 200,
            backgroundColor: "white",
            justifyContent: "flex-end"
          }}
        >
          <Text style={[styles.sectionTitle, { padding: 20 }]}>
            Add Location
          </Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={[styles.sectionTitle]}>Basic info</Text>

          {/* TODO: replace with actual fields */}
          <View style={styles.fieldset}>
            <TouchableHighlight
              onPress={() =>
                navigate("FieldsetForm", { fieldset: { title: "Basic info" } })}
            >
              <View style={styles.field}>
                <View>
                  <Text style={styles.fieldLabel}>Label</Text>
                  <Text style={styles.fieldValue}>Default value</Text>
                </View>
                <View style={styles.fieldArrow}>
                  <Text>＞</Text>
                </View>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() =>
                navigate("FieldsetForm", { fieldset: { title: "Basic info" } })}
            >
              <View style={styles.field}>
                <View>
                  <Text style={styles.fieldLabel}>Label</Text>
                  <Text style={styles.fieldValue}>Default value</Text>
                </View>
                <View style={styles.fieldArrow}>
                  <Text>＞</Text>
                </View>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() =>
                navigate("FieldsetForm", { fieldset: { title: "Basic info" } })}
            >
              <View style={styles.field}>
                <View>
                  <Text style={styles.fieldLabel}>Label</Text>
                  <Text style={styles.fieldValue}>Default value</Text>
                </View>
                <View style={styles.fieldArrow}>
                  <Text>＞</Text>
                </View>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() =>
                navigate("FieldsetForm", { fieldset: { title: "Basic info" } })}
            >
              <View style={styles.field}>
                <View>
                  <Text style={styles.fieldLabel}>Label</Text>
                  <Text style={styles.fieldValue}>Default value</Text>
                </View>
                <View style={styles.fieldArrow}>
                  <Text>＞</Text>
                </View>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </Wrapper>
    );
  }
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5
  },
  fieldset: {
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#ccc"
  },
  field: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "white",
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  fieldLabel: {
    fontSize: 10
  },
  fieldValue: {
    color: "#aaa"
  },
  fieldArrow: {}
});

export default AddObservationScreen;
