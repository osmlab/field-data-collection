import { StackNavigator } from "react-navigation";

import ObservationsScreen from "./observations";
import SettingsScreen from "./settings";
import AboutScreen from "./about";
import AddSurveyScreen from "./add-survey";
import SurveysScreen from "./surveys";

const SettingsNavigator = StackNavigator(
  {
    AccountObservations: { screen: ObservationsScreen },
    Settings: { screen: SettingsScreen },
    About: { screen: AboutScreen },
    Surveys: { screen: SurveysScreen },
    AddSurvey: { screen: AddSurveyScreen }
  },
  {
    headerMode: "none"
  }
);

export default SettingsNavigator;
