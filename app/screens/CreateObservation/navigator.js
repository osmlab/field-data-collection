import { StackNavigator } from "react-navigation";

import CategoriesScreen from "./categories";
import AddObservationScreen from "./add-observation";
import FieldsetFormScreen from "./fieldset-form";

const routeConfiguration = {
  Categories: { screen: CategoriesScreen },
  AddObservation: { screen: AddObservationScreen },
  FieldsetForm: { screen: FieldsetFormScreen }
};

const Navigator = StackNavigator(routeConfiguration, {
  headerMode: "none"
});

export default Navigator;

export const reducer = (state, action) => {
  return Navigator.router.getStateForAction(action, state);
};
