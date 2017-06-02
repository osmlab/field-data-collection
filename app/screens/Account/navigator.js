import { StackNavigator } from "react-navigation";

import ObservationsScreen from "./observations";
import SettingsScreen from "./settings";
import AboutScreen from "./about";
import AddSurveyScreen from "./add-survey";
import SurveysScreen from "./surveys";

const routeConfiguration = {
  AccountObservations: { screen: ObservationsScreen },
  Settings: { screen: SettingsScreen },
  About: { screen: AboutScreen },
  Surveys: { screen: SurveysScreen },
  AddSurvey: { screen: AddSurveyScreen }
};

const Navigator = StackNavigator(routeConfiguration, {
  headerMode: "none"
});

export default Navigator;

export const reducer = (state, action) => {
  return Navigator.router.getStateForAction(action, state);
};