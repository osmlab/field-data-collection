import { StackNavigator } from "react-navigation";

import ObservationCreateNavigator from "../CreateObservation/navigator";

// Account screens
import AboutScreen from "../Account/about";
import AddSurveyScreen from "../Account/add-survey";
import AddProfileScreen from "../Account/profile";
import SettingsScreen from "../Account/settings";
import SurveysScreen from "../Account/surveys";
import SurveyScreen from "../Account/survey";
import ObservationsScreen from "../Account/observations";

// Observations
import ObservationMapScreen from "../Observations/map.js";
import ObservationListScreen from "../Observations/list.js";

const routeConfiguration = {
  ObservationMap: { screen: ObservationsScreen },
  ObservationList: { screen: ObservationListScreen },
  MyObservations: { screen: ObservationsScreen },
  CreateObservation: { screen: ObservationCreateNavigator },
  About: { screen: AboutScreen },
  AddSurvey: { screen: AddSurveyScreen },
  AddProfile: { screen: AddProfileScreen },
  Settings: { screen: SettingsScreen },
  Surveys: { screen: SurveysScreen },
  Survey: { screen: SurveyScreen }
};

const Navigator = StackNavigator(routeConfiguration, {
  headerMode: "none"
});

export default Navigator;

export const reducer = (state, action) => {
  return Navigator.router.getStateForAction(action, state);
};
