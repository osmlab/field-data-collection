import { StackNavigator } from 'react-navigation';

import CategoryScreen from './category';

const CreateObservationNavigator = StackNavigator({
  Category: { screen: CategoryScreen }
});

export default CreateObservationNavigator;
