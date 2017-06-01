import { TabNavigator, TabBarBottom } from "react-navigation";

import ObservationsNavigator from "../Observations/navigator";
import ObservationCreateNavigator from "../CreateObservation/navigator";
import AccountScreen from "../Account/navigator";

const routeConfiguration = {
  Observations: { screen: ObservationsNavigator },
  CreateObservation: { screen: ObservationCreateNavigator },
  Account: { screen: AccountScreen }
};

const Navigator = TabNavigator(routeConfiguration, {
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
});

export default Navigator;

export const reducer = (state, action) => {
  return Navigator.router.getStateForAction(action, state);
};
