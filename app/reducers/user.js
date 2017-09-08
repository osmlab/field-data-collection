import DeviceInfo from "react-native-device-info";
import types from "../actions";

const initialState = {
  name: null,
  email: null,
  coords: null,
  deviceId: DeviceInfo.getUniqueID()
};

export default (state = initialState, { name, email, type }) => {
  switch (type) {
    case types.SET_PROFILE_INFO:
      return {
        ...state,
        name,
        email
      };

    default:
      return state;
  }
};
