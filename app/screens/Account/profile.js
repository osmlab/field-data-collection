import React, { Component } from "react";
import { StyleSheet, View, Button } from "react-native";
import { NavigationActions } from "react-navigation";

import { Text, Wrapper } from "../../components";
import { baseStyles } from "../../styles";

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 17
  }
});

class ProfileScreen extends Component {
  render() {
    const { navigate } = this.props.navigation;

    const onBackPress = () => {
      const backAction = NavigationActions.back();
      this.props.navigation.dispatch(backAction);
    };

    return (
      <Wrapper navigation={this.props.navigation}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <Text
            style={{ fontSize: 30, marginTop: -10, marginRight: 5 }}
            onPress={onBackPress}
          >
            ←
          </Text>
          <Text style={[baseStyles.title]}>Profile</Text>
        </View>

        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Text style={styles.subtitle}>
            Enter your information for your edits to be associated to you.
          </Text>
        </View>
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Text style={styles.subtitle}>
            Enter your information for your edits to be associated to you.
          </Text>
        </View>
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Text style={styles.subtitle}>
            Enter your information for your edits to be associated to you.
          </Text>
        </View>
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Text style={styles.subtitle}>
            Enter your information for your edits to be associated to you.
          </Text>
        </View>
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Text style={styles.subtitle}>
            Enter your information for your edits to be associated to you.
          </Text>
        </View>
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Text style={styles.subtitle}>
            Enter your information for your edits to be associated to you.
          </Text>
        </View>
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Text style={styles.subtitle}>
            Enter your information for your edits to be associated to you.
          </Text>
        </View>
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Text style={styles.subtitle}>
            Enter your information for your edits to be associated to you.
          </Text>
        </View>
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Text style={styles.subtitle}>
            Enter your information for your edits to be associated to you.
          </Text>
        </View>
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Text style={styles.subtitle}>
            Enter your information for your edits to be associated to you.
          </Text>
        </View>
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Text style={styles.subtitle}>
            Enter your information for your edits to be associated to you.
          </Text>
        </View>
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Text style={styles.subtitle}>
            Enter your information for your edits to be associated to you.
          </Text>
        </View>
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Text style={styles.subtitle}>
            Enter your information for your edits to be associated to you.
          </Text>
        </View>
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Text style={styles.subtitle}>
            Enter your information for your edits to be associated to you.
          </Text>
        </View>
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Text style={styles.subtitle}>
            Enter your information for your edits to be associated to you.
          </Text>
        </View>

      </Wrapper>
    );
  }
}

export default ProfileScreen;
