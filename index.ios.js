import "./global";

import { TabNavigator, TabBarBottom } from "react-navigation";
import { AppRegistry } from "react-native";

import ObservationsNavigator from "./screens/observations";
import ObservationCreateNavigator from "./screens/observation-create";
import AccountScreen from "./screens/account";

import locale from "./locale/";

console.log("locale.map", locale.map);

const Surveyor = TabNavigator(
  {
    Observations: { screen: ObservationsNavigator },
    CreateObservation: { screen: ObservationCreateNavigator },
    Account: { screen: AccountScreen }
  },
  {
    tabBarComponent: TabBarBottom,
    tabBarPosition: "bottom",
    swipeEnabled: false,
    animationEnabled: false,
    tabBarOptions: {
      showIcon: false,
      style: {
        backgroundColor: "white"
      }
    }
  }
);

AppRegistry.registerComponent("Surveyor", () => Surveyor);
