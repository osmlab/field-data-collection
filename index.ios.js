import './global';

import { TabNavigator, TabBarBottom } from 'react-navigation';
import { AppRegistry } from 'react-native';

import MapScreen from './screens/map';
import ObservationsScreen from './screens/observations';
import i18n from './i18n';

console.log('i18n.map', i18n.map)

const Surveyor = TabNavigator({
  Map: { screen: MapScreen },
  Observations: { screen: ObservationsScreen }
}, {
  tabBarComponent: TabBarBottom,
  tabBarPosition: 'bottom',
  swipeEnabled: false,
  animationEnabled: false,
  tabBarOptions: {
    showIcon: false,
    style: {
      backgroundColor: 'white'
    }
  }
});

AppRegistry.registerComponent('Surveyor', () => Surveyor);
