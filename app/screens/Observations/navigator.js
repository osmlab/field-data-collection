import { StackNavigator } from "react-navigation";

import ObservationMapScreen from "./map";
import ObservationListScreen from "./list";

const routeConfiguration = {
  ObservationMap: { screen: ObservationMapScreen },
  ObservationList: { screen: ObservationListScreen }
};

const Navigator = StackNavigator(routeConfiguration, {
  headerMode: "none",
  animationEnabled: false
});

export default Navigator;

export const reducer = (state, action) => {
  return Navigator.router.getStateForAction(action, state);
};
