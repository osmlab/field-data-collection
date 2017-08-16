import React, { Component } from "react";
import { SectionList, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Link } from "react-router-native";

import Text from "./text";
import { baseStyles } from "../styles";

const styles = StyleSheet.create({
  category: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 5,
    paddingLeft: 20,
    height: 40
  }
});

export default class CategoryList extends Component {
  state = {
    visible: []
  };

  isVisible = sectionId =>
    // always show items within a single category
    this.props.categories.length === 1 ||
    this.state.visible.includes(sectionId);

  renderItem = (surveyId, sectionId, { item }) =>
    this.isVisible(sectionId)
      ? <Link to={`/observation/${surveyId}/${item.id}`}>
          <Text style={styles.category}>
            {item.name}
          </Text>
        </Link>
      : null;

  renderSectionHeader = ({ section }) => {
    const { categories } = this.props;

    if (categories.length === 1) {
      // never show the header when only 1 category exists
      return null;
    }

    const arrowDirection = this.isVisible(section.key)
      ? "keyboard-arrow-down"
      : "keyboard-arrow-right";

    return (
      <TouchableOpacity onPress={() => this.toggleVisibility(section.key)}>
        <Text style={baseStyles.h2}>
          <Icon name={arrowDirection} style={{ fontSize: 26, height: 40 }} />
          {section.key}
        </Text>
      </TouchableOpacity>
    );
  };

  toggleVisibility = sectionId => {
    const { visible } = this.state;

    if (this.isVisible(sectionId)) {
      this.setState({
        visible: visible.filter(x => x !== sectionId)
      });
    } else {
      this.setState({
        visible: visible.concat(sectionId)
      });
    }
  };

  render() {
    const { categories } = this.props;

    return (
      <SectionList
        keyExtractor={(item, idx) => idx}
        renderSectionHeader={this.renderSectionHeader}
        sections={categories.map(({ list: data, name: key, surveyId }) => ({
          key,
          data,
          renderItem: info => this.renderItem(surveyId, key, info)
        }))}
      />
    );
  }
}
