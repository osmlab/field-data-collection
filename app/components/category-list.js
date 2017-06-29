import React, { Component } from "react";
import {
  View,
  ListView,
  TouchableOpacity,
  Animated,
  StyleSheet
} from "react-native";
import Interactable from "react-native-interactable";
import Icon from "react-native-vector-icons/MaterialIcons";

import Text from "./text";
import { baseStyles } from "../styles";

const styles = StyleSheet.create({
  categoryList: {},
  category: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 5,
    paddingLeft: 20,
    height: 40
  },
  categoryHeader: { padding: 5, height: 40 }
});

class CategoryList extends Component {
  render() {
    const { navigation, categories } = this.props;

    return (
      <View style={styles.categoryList}>
        {categories.map(category => {
          return (
            <CategoryView
              navigation={navigation}
              category={category}
              key={category.name}
            />
          );
        })}
      </View>
    );
  }
}

class CategoryView extends Component {
  componentWillMount() {
    const { category } = this.props;

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.setState({
      expanded: false,
      minHeight: null,
      maxHeight: null,
      animation: new Animated.Value(),
      categoryName: category.name,
      categories: ds.cloneWithRows(
        category.list.map(item => ({
          id: item.id,
          name: item.name
        }))
      )
    });
  }

  _setMinHeight = e => {
    this.state.animation.setValue(20);
    if (!this.state.minHeight) {
      this.state.minHeight = 20;
    }
  };

  _setMaxHeight = e => {
    if (!this.state.maxHeight) {
      this.state.maxHeight = e.nativeEvent.layout.height;
    }
  };

  toggle = () => {
    const { expanded, maxHeight, minHeight } = this.state;
    const initialHeight = expanded ? maxHeight + minHeight : minHeight;
    const finalHeight = expanded ? minHeight : maxHeight + minHeight;

    this.setState({
      expanded: !expanded
    });

    this.state.animation.setValue(initialHeight);
    Animated.timing(this.state.animation, {
      duration: 250,
      toValue: finalHeight
    }).start();
  };

  render() {
    const { navigate } = this.props.navigation;
    const { expanded, categoryName, categories } = this.state;
    const arrowDirection = expanded
      ? "keyboard-arrow-down"
      : "keyboard-arrow-right";
    const arrowIcon = (
      <Icon name={arrowDirection} style={{ fontSize: 26, height: 40 }} />
    );

    return (
      <Animated.View style={{ height: this.state.animation }}>
        <View style={styles.categoryHeader} onLayout={this._setMinHeight}>
          <TouchableOpacity
            style={{
              padding: 5
            }}
            onPress={this.toggle}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {arrowIcon}
              <Text style={[baseStyles.h2, { height: 40 }]}>
                {" "}{categoryName}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <Interactable.View
          verticalOnly={true}
          snapPoints={[]}
          onLayout={this._setMaxHeight}
        >
          <ListView
            contentContainerStyle={{ marginTop: 10 }}
            dataSource={categories}
            noScroll={true}
            renderRow={category => {
              function onCategoryPress() {
                navigate("AddObservation", { category });
              }

              return (
                <View style={styles.category}>
                  <TouchableOpacity onPress={onCategoryPress}>
                    <Text>{category.name}</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </Interactable.View>
      </Animated.View>
    );
  }
}

export default CategoryList;
