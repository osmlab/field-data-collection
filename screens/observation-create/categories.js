import React from 'react';
import { StyleSheet, View, Button, Text, ListView } from 'react-native';

import baseStyles from '../../styles/index'

class CategoriesScreen extends React.Component {
  constructor () {
    super();

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => { r1 !== r2 }
    });

    this.state = {
      categories: ds.cloneWithRows([
        { name: 'Oil spills' },
        { name: 'Blast Fishing' },
        { name: 'Schools' },
        { name: 'Buildings' },
        { name: 'Hazards' }
      ]),
    };
  }

  render () {
    const { navigate } = this.props.navigation;

    return (
      <View style={baseStyles.container}>
        <Text style={styles.title}>
          What do you want to add?
        </Text>

        <ListView
          contentContainerStyle={styles.gridContainer}
          dataSource={this.state.categories}
          noScroll={true}
          renderRow={(item) => {
            return (
              <View style={styles.gridItem}>
                <Text onPress={(e) => { console.log('')}}>{item.name}</Text>
              </View>
            );
          }}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
          <Button
            onPress={() => {}}
            title='View More'
            accessibilityLabel='View More'
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20
  },
  gridItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    marginBottom: 10,
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});

export default CategoriesScreen;
