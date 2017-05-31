import { StackNavigator } from "react-navigation";

import ObservationMapScreen from "./map";
import ObservationListScreen from "./list";

const ObservationsNavigator = StackNavigator(
  {
    ObservationMap: { screen: ObservationMapScreen },
    ObservationList: { screen: ObservationListScreen }
  },
  {
    headerMode: "none",
    animationEnabled: false
  }
);

export default ObservationsNavigator;
