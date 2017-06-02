import { StackNavigator } from "react-navigation";

import ObservationFormMainScreen from "./main";

const Navigator = StackNavigator({
  ObservationFormMain: { screen: ObservationFormMainScreen }
});

export default Navigator;

export const reducer = (state, action) => {
  return Navigator.router.getStateForAction(action, state);
};
