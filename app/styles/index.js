import { StyleSheet } from "react-native";

const colors = {
  interface: {
    links: "#8212C6",
    headerBackground: "#6579FC",
    geolocationIconInside: "#C3CAFA",
    relatedItemsBackground: "#FDFDFD",
    error: "#FF5C3F"
  },
  text: {
    header: "#575456",
    secondary: "#716674",
    tertiary: "#948D94"
  }
};

const baseText = {
  fontFamily: "Noto, sans-serif",
  fontSize: 16,
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
    fontFamily: "Roboto",
    fontSize: 32,
    fontWeight: "bold",
    paddingBottom: 10,
    color: colors.text.header
  },
  h2: {
    fontFamily: "Roboto",
    fontSize: 28,
    fontWeight: "bold",
    paddingBottom: 10,
    color: colors.text.header
  },
  h3: {
    fontFamily: "Roboto",
    fontSize: 26,
    fontWeight: "bold",
    color: colors.text.header
  },
  h4: {
    fontFamily: "Roboto",
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text.header
  },
  h5: {
    fontFamily: "Roboto",
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.header
  },

  //links
  navLink: {
    backgroundColor: "transparent",
    paddingTop: 25,
    paddingBottom: 25,
    paddingLeft: 30,
    paddingRight: 30,
    borderBottomColor: colors.text.tertiary,
    borderBottomWidth: 0.5
  },
  linkUnderline: {
    borderBottomColor: colors.text.header,
    borderBottomWidth: 0.5
  },
  link: {
    color: colors.interface.links,
    borderBottomColor: colors.interface.links,
    borderBottomWidth: 0.5
  },

  headerPage: {
    backgroundColor: colors.interface.headerBackground,
    color: "#ffffff"
  },
  titleMenu: {
    paddingTop: 30,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30
  },

  //buttons
  buttonBottom: {
    backgroundColor: colors.interface.links,
    color: "#ffffff"
  },
  buttonOutline: {
    borderBottomColor: colors.text.header,
    borderBottomWidth: 0.5,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 4
  },
  buttonContent: {
    backgroundColor: colors.interface.links,
    color: "#ffffff",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 4
  }
});

export { baseStyles, colors, baseText };
