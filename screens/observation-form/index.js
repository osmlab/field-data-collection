import { StackNavigator } from "react-navigation";

import ObservationFormMainScreen from "./category";

const ObservationFormNavigator = StackNavigator({
  ObservationFormMain: { screen: ObservationFormMainScreen }
});

export default ObservationFormNavigator;
