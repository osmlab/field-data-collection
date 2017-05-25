import { StackNavigator } from 'react-navigation';

import CategoriesScreen from './categories';
import AddObservationScreen from './add-observation';
import FieldsetFormScreen from './fieldset-form';

const CreateObservationNavigator = StackNavigator({
  Categories: { screen: CategoriesScreen },
  AddObservation: { screen: AddObservationScreen },
  FieldsetForm: { screen: FieldsetFormScreen }
}, {
  headerMode: 'none'
});

export default CreateObservationNavigator;
