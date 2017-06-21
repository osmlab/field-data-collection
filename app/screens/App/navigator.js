import { StackNavigator } from "react-navigation";

import ObservationsNavigator from "../Observations/navigator";
import ObservationCreateNavigator from "../CreateObservation/navigator";
import AccountScreen from "../Account/navigator";

const routeConfiguration = {
  Observations: { screen: ObservationsNavigator },
  CreateObservation: { screen: ObservationCreateNavigator },
  Account: { screen: AccountScreen }
};

const Navigator = StackNavigator(routeConfiguration, {
  headerMode: "none"
});

export default Navigator;

export const reducer = (state, action) => {
  return Navigator.router.getStateForAction(action, state);
};
