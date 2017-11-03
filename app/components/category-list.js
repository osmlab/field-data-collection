import React, { Component } from "react";
import { SectionList, StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Link } from "react-router-native";
import _ from "lodash";

import Text from "./text";
import { baseStyles } from "../styles";

const styles = StyleSheet.create({
  category: {
    borderColor: "#E5E5E5",
    borderWidth: 1,
    padding: 20,
    marginLeft: 20,
    marginRight: 20
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

  renderItem = (surveyId, sectionId, { item }) => {
    const { onSelect } = this.props;

    if (this.isVisible(sectionId)) {
      return (
        <TouchableOpacity onPress={() => onSelect(item)}>
          <Text style={styles.category}>
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  renderSectionHeader = ({ section }) => {
    const { categories } = this.props;

    const arrowDirection = this.isVisible(section.key)
      ? "keyboard-arrow-down"
      : "keyboard-arrow-right";

    return (
      <TouchableOpacity
        style={[baseStyles.WrapperListItem, { flex: 1, flexDirection: "row" }]}
        onPress={() => this.toggleVisibility(section.key)}
      >
        <Icon
          name={arrowDirection}
          style={[baseStyles.formArrowCategories, baseStyles.wrappedItemsSm]}
        />
        <Text style={[baseStyles.h3, baseStyles.wrappedItemsLg]}>
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
        style={{ marginBottom: 100 }}
        keyExtractor={(item, idx) => idx}
        renderSectionHeader={this.renderSectionHeader}
        sections={categories.map(({ list: data, name: key, surveyId }) => ({
          key,
          data: _.sortBy(data, [d => d.name]),
          renderItem: info => this.renderItem(surveyId, key, info)
        }))}
      />
    );
  }
}
