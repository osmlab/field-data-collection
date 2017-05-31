import { StyleSheet } from "react-native";

const colors = {
  interface: {
    button: "#1de9b6",
    text: "#00BFA5",
    headerBackground: "#6579FC",
    geolocationIconInside: "#C3CAFA",
    relatedItemsBackground: "#FBFAFA",
    error: "#FF5C3F"
  },
  text: {
    header: "#575456",
    secondary: "#716674",
    tertiary: "#948D94"
  }
};

const baseText = {
  fontSize: 18,
  color: colors.text.tertiary
};

const baseStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "column",
    // justifyContent: 'flex-start',
    backgroundColor: "#ffffff",
    padding: 20
  },
  title: {
    fontSize: 25,
    fontWeight: "bold"
  }
});

export { baseStyles, colors, baseText };
