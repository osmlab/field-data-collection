import { StyleSheet } from "react-native";

const colors = {
  interface: {
    links: "#8212C6",
    headerBackground: "#6579FC",
    geolocationIconInside: "#C3CAFA",
    relatedItemsBackground: "#FDFDFD",
    error: "#FF5C3F",
    chartColor: "#1DE9B6"
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
    backgroundColor: "#ffffff"
  },
  wrapperContent: {
    padding: 20
  },
  wrapperContentSm: {
    padding: 20,
    paddingBottom: 7
  },
  wrapperContentLg: {
    paddingBottom: 30,
    paddingTop: 30
  },
  wrapperContentHeader: {
    padding: 20,
    paddingTop: 26,
    paddingBottom: 30,
    marginBottom: 20,
    position: "relative"
  },
  listBlock: {
    borderBottomColor: colors.text.tertiary,
    borderBottomWidth: 0.5
  },
  wrappedItems: {
    flexDirection: "row"
  },
  mainHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  mainHeaderSpace: {
    marginTop: 20
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
    color: colors.text.tertiary
  },
  headerWithDescription: {
    marginBottom: 3
  },
  spacer: {
    marginBottom: 2
  },
  observationBlock: {
    marginTop: 10
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
  spaceBelowMd: {
    marginBottom: 22
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
    textDecorationLine: "underline",
    color: colors.interface.links
  },
  headerLink: {
    textDecorationLine: "underline"
  },

  headerPage: {
    backgroundColor: colors.interface.headerBackground,
    marginBottom: 0
  },
  headerPageText: {
    flex: 0.75,
    paddingTop: 6
  },
  titleMenu: {
    paddingTop: 30,
    paddingBottom: 10,
    paddingLeft: 30,
    paddingRight: 30
  },
  headerBackIcon: {
    fontSize: 28,
    marginRight: 10,
    color: colors.text.tertiary
  },
  headerTitle: {
    paddingTop: 10
  },

  //buttons
  buttonBottom: {
    backgroundColor: colors.interface.links,
    flexDirection: "row",
    justifyContent: "center",
    left: 0,
    right: 0,
    bottom: 0,
    marginTop: 20,
    paddingTop: 15,
    paddingBottom: 15,
    height: 50
  },
  buttonOutline: {
    borderColor: colors.text.header,
    borderWidth: 1,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 4
  },
  buttonContent: {
    backgroundColor: colors.interface.links,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 20,
    paddingRight: 20,
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
  nearbyPoints: {
    backgroundColor: "#ffffff",
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    height: 180,
    borderColor: colors.text.tertiary,
    flex: 1,
    elevation: 10
  },
  nearbyPointsHeader: {
    padding: 20,
    paddingTop: 15,
    flexDirection: "row",
    alignItems: "stretch"
  },
  nearbyPointsDescription: {
    flex: 0.75
  },
  cardStyle: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    alignContent: "center",
    height: 100,
    padding: 20,
    paddingTop: 30
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
  percentCompleteWrapper: {
    top: 65,
    right: 15,
    position: "absolute"
  },
  percentComplete: {
    backgroundColor: "#ffffff",
    width: 70,
    height: 70,
    borderRadius: 80,
    position: "relative",
    elevation: 6,
    justifyContent: "center",
    alignSelf: "center"
  },
  percentCompleteTextSm: {
    textAlign: "center",
    position: "absolute",
    width: 70
  },
  percentCompleteTextNumSm: {
    fontWeight: "bold"
  },
  percentCompleteText: {
    textAlign: "center",
    paddingTop: 18,
    fontSize: 14,
    position: "absolute"
  },
  percentCompleteTextNum: {
    fontSize: 22,
    fontWeight: "bold"
  },
  map: {
    height: 100,
    borderBottomColor: "#ccc",
    borderBottomWidth: 0.5
  },
  mapLg: {
    height: 250,
    borderBottomColor: "#ccc",
    borderBottomWidth: 0.5,
    backgroundColor: "#F3F3F3",
    position: "relative"
  },
  mapEditorBlock: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: 20,
    justifyContent: "flex-end",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0
  },

  syncHeader: {
    flexDirection: "row",
    alignItems: "stretch",
    flex: 1
  },
  syncHeaderText: {
    paddingTop: 10
  },
  wrappedItemsLeft: {
    flex: 0.75
  },

  formArrow: {
    fontSize: 28,
    color: colors.interface.links,
    paddingTop: 6
  }
});

export { baseStyles, colors, baseText };
