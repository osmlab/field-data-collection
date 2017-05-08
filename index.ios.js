import { TabNavigator, TabBarBottom } from 'react-navigation';
import { AppRegistry } from 'react-native';

import MapScreen from './screens/map';
import ObservationsScreen from './screens/observations';

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
      backgroundColor: 'white',
      border-top: '1px solid #333333'
    }
  }
});

AppRegistry.registerComponent('Surveyor', () => Surveyor);
