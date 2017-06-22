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
    tertiary: "#8D8D8D"
  }
};

const baseText = {
  fontFamily: "Noto, sans-serif",
  fontSize: 16,
  color: colors.text.secondary
};

const baseStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "column",
    // justifyContent: 'flex-start',
    backgroundColor: "#ffffff"
  },
  wrapperContent: {
    padding: 20
  },
  wrapperContentHeader: {
    padding: 20,
    paddingTop: 26,
    paddingBottom: 30,
    marginBottom: 20
  },
  listBlock: {
    borderBottomColor: colors.text.tertiary,
    borderBottomWidth: 0.5
  },

  //text
  title: {
    fontFamily: "Roboto",
    fontSize: 32,
    fontWeight: "bold",
    paddingBottom: 10,
    color: colors.text.header
  },
  h2: {
    fontFamily: "Roboto",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.text.header
  },
  h3: {
    fontFamily: "Roboto",
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text.header,
    marginBottom: 10
  },
  h4: {
    fontFamily: "Roboto",
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.header
  },
  h5: {
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: "bold",
    color: colors.text.header
  },
  textWhite: {
    color: "#ffffff"
  },
  metadataText: {
    fontStyle: "italic",
    marginRight: 10,
    color: colors.text.secondary
  },
  headerWithDescription: {
    marginBottom: 5
  },
  observationBlock: {
    marginTop: 15
  },
  textAlert: {
    fontStyle: "italic",
    color: colors.interface.error
  },
  withPipe: {
    marginRight: 15
  },
  spaceBelow: {
    marginBottom: 15
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
    borderBottomWidth: 0.5,
    borderBottomColor: colors.interface.links
  },

  headerPage: {
    backgroundColor: colors.interface.headerBackground
  },
  titleMenu: {
    paddingTop: 30,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30
  },
  headerBackIcon: {
    fontSize: 30,
    marginTop: -10,
    marginRight: 5
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
  },

  //Fieldset
  fieldset: {
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#ccc"
  },
  field: {
    backgroundColor: "white",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  fieldValue: {
    color: colors.text.tertiary
  },
  fieldArrow: {
    fontSize: 15,
    color: colors.interface.links,
    paddingTop: 13
  },

  surveyCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    position: "relative"
  },
  surveyCardContent: {
    padding: 20,
    paddingBottom: 25
  },
  percentComplete: {
    backgroundColor: "#ffffff",
    width: 60,
    height: 60,
    borderRadius: 80,
    position: "absolute",
    top: 70,
    right: 20,
    elevation: 6
  },
  percentCompleteText: {
    textAlign: "center",
    paddingTop: 18
  },
  map: {
    height: 100,
    borderBottomColor: "#ccc",
    borderBottomWidth: 0.5
  }
});

export { baseStyles, colors, baseText };
