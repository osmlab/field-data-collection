import { StackNavigator } from 'react-navigation';

import ObservationsScreen from './observations'
import SettingsScreen from './settings';
import AboutScreen from './about';
import AddSurveyScreen from './add-survey';

const SettingsNavigator = StackNavigator({
  AccountObservations: { screen: ObservationsScreen },
  Settings: { screen: SettingsScreen },
  About: { screen: AboutScreen },
  AddSurvey: { screen: AddSurveyScreen }
}, {
  headerMode: 'none'
});

export default SettingsNavigator;
