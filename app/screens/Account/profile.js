import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Link } from "react-router-native";

import { Text, Wrapper } from "../../components";
import { baseStyles } from "../../styles";

import { selectUser } from "../../selectors";
import { setProfileInfo } from "../../actions";

const Screen = Dimensions.get("window");

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 17
  }
});

class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    let { name, email } = props;
    this.state = {
      name,
      email
    };

    this.save = this.save.bind(this);
  }

  save() {
    const { setProfileInfo } = this.props;
    let { name, email } = this.state;
    setProfileInfo({ name, email });
  }

  onValueChange(label) {
    return data => {
      this.setState({ [label]: data });
    };
  }

  render() {
    var { name, email } = this.state;

    const headerView = (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center"
        }}
      >
        <Link to="/">
          <Icon
            name="keyboard-backspace"
            style={[[baseStyles.headerBackIcon]]}
          />
        </Link>

        <Text style={[baseStyles.h3, baseStyles.headerTitle]}>Profile</Text>
      </View>
    );

    return (
      <Wrapper headerView={headerView}>
        <ScrollView
          style={[
            baseStyles.wrapperContent,
            {
              flex: 1,
              flexDirection: "column",
              height: Screen.height - 85
            }
          ]}
        >
          <Text style={styles.subtitle}>
            Enter your information for your edits to be associated to you.
          </Text>
          <View style={{ marginTop: 40, marginBottom: 20 }}>
            <Text style={baseStyles.fieldLabel}>Name</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={this.onValueChange("name")}
              value={name}
            />
          </View>
          <View style={{ marginTop: 20, marginBottom: 20 }}>
            <Text style={baseStyles.fieldLabel}>Email</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={this.onValueChange("email")}
              keyboardType="email-address"
              value={email}
            />
          </View>
        </ScrollView>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            flexDirection: "row"
          }}
        >
          <TouchableOpacity onPress={this.save} style={baseStyles.buttonBottom}>
            <Text style={baseStyles.textWhite}>SAVE</Text>
          </TouchableOpacity>
        </View>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let user = selectUser(state);
  let name = user.name || "";
  let email = user.email || "";

  return {
    name,
    email
  };
};

export default connect(mapStateToProps, {
  setProfileInfo
})(ProfileScreen);
