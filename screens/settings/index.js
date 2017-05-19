import { StackNavigator } from 'react-navigation';

import MainSettingsScreen from './main';
import AboutScreen from './about';
import AddSurveyScreen from './load-survey';

const SettingsNavigator = StackNavigator({
  MainSettings: { screen: MainSettingsScreen },
  About: { screen: AboutScreen },
  LoadSurvey: { screen: AddSurveyScreen }
});

export default SettingsNavigator;
