import { StackNavigator } from "react-navigation";

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
import AddObservationScreen from "../Observations/create";
import FieldsetFormScreen from "../Observations/fieldset-form";
import CategoriesScreen from "../Observations/categories";
import LocationScreen from "../Observations/location";

const routeConfiguration = {
  ObservationMap: { screen: ObservationMapScreen },
  ObservationList: { screen: ObservationListScreen },
  MyObservations: { screen: ObservationsScreen },
  About: { screen: AboutScreen },
  AddSurvey: { screen: AddSurveyScreen },
  AddProfile: { screen: AddProfileScreen },
  Settings: { screen: SettingsScreen },
  Surveys: { screen: SurveysScreen },
  Survey: { screen: SurveyScreen },
  AddObservation: { screen: AddObservationScreen },
  FieldsetForm: { screen: FieldsetFormScreen },
  Categories: { screen: CategoriesScreen },
  Location: { screen: LocationScreen }
};

const Navigator = StackNavigator(routeConfiguration, {
  headerMode: "none"
});

export default Navigator;

export const reducer = (state, action) => {
  return Navigator.router.getStateForAction(action, state);
};
