import { StackNavigator } from 'react-navigation';

import CategoriesScreen from './categories';

const CreateObservationNavigator = StackNavigator({
  Categories: { screen: CategoriesScreen }
}, {
  headerMode: 'none'
});

export default CreateObservationNavigator;
