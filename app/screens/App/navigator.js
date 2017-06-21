import { StackNavigator } from "react-navigation";

import ObservationCreateNavigator from "../CreateObservation/navigator";

// Account screens
import AboutScreen from "../Account/about";
import AddSurveyScreen from "../Account/add-survey";
import AddProfileScreen from "../Account/profile";
import SettingsScreen from "../Account/settings";
import SurveysScreen from "../Account/surveys";

// Observations
import ObservationMapScreen from "../Observations/map.js";
import ObservationListScreen from "../Observations/list.js";

const routeConfiguration = {
  ObservationMap: { screen: ObservationMapScreen },
  ObservationList: { screen: ObservationListScreen },
  CreateObservation: { screen: ObservationCreateNavigator },
  About: { screen: AboutScreen },
  AddSurvey: { screen: AddSurveyScreen },
  AddProfile: { screen: AddProfileScreen },
  Settings: { screen: SettingsScreen },
  Surveys: { screen: SurveysScreen }
};

const Navigator = StackNavigator(routeConfiguration, {
  headerMode: "none"
});

export default Navigator;

export const reducer = (state, action) => {
  return Navigator.router.getStateForAction(action, state);
};
