import { StackNavigator } from 'react-navigation';

import CategoriesScreen from './categories';
import AddObservationScreen from './add-observation';

const CreateObservationNavigator = StackNavigator({
  Categories: { screen: CategoriesScreen },
  AddObservation: { screen: AddObservationScreen }
}, {
  headerMode: 'none'
});

export default CreateObservationNavigator;
