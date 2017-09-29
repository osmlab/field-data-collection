import { StyleSheet, Dimensions } from "react-native";

const screen = Dimensions.get("window");
const Screen = Dimensions.get("window");

const colors = {
  interface: {
    links: "#8212C6",
    headerBackground: "#6579FC",
    geolocationIconInside: "#C3CAFA",
    geolocationIcon: "#2C2C2C",
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
  wrapperContentMd: {
    padding: 25
  },
  wrapperContentMdHeader: {
    padding: 25,
    paddingBottom: 10,
    paddingTop: 18
  },
  wrapperContentMdInterior: {
    padding: 25,
    paddingTop: 0,
    paddingBottom: 0
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
  WrapperListItem: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 10
  },
  wrapperPadding: {
    paddingTop: 15,
    paddingBottom: 15
  },

  //Modal
  modalBg: {
    backgroundColor: "rgba(57, 54, 54, .8)",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  modal: {
    marginTop: 20,
    backgroundColor: "#fff",
    width: screen.width - 40,
    height: screen.height - 70,
    alignSelf: "center",
    elevation: 15
  },
  touchableLinksWrapper: {
    marginTop: 10,
    marginBottom: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 25,
    paddingRight: 25
  },
  touchableLinks: {
    fontSize: 22
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
    marginBottom: 0,
    position: "relative"
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
  clearIcon: {
    fontSize: 28,
    color: colors.interface.links,
    justifyContent: "flex-end",
    flexDirection: "column"
  },

  //buttons
  buttonBottom: {
    backgroundColor: colors.interface.links,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 15,
    height: 50,
    width: Screen.width
  },
  buttonOutline: {
    borderColor: colors.text.header,
    borderWidth: 2,
    paddingTop: 12,
    paddingBottom: 10,
    paddingLeft: 25,
    paddingRight: 25,
    borderRadius: 4,
    fontWeight: "bold"
  },
  buttonContent: {
    backgroundColor: colors.interface.links,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 4
  },
  buttonContentWrapper: {
    flexWrap: "wrap",
    alignItems: "flex-start",
    flexDirection: "row"
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
    paddingRight: 5,
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
    backgroundColor: "#fdfdfd",
    height: 400,
    elevation: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5"
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
    alignContent: "center",
    height: 140,
    padding: 20,
    paddingTop: 15,
    marginLeft: 15,
    marginRight: 15,
    width: screen.width - 75,
    elevation: 3,
    backgroundColor: "#fff"
  },
  surveyCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    position: "relative"
  },
  surveyCardContent: {
    padding: 20,
    paddingBottom: 12,
    paddingRight: 22,
    paddingLeft: 22
  },
  percentCompleteWrapper: {
    right: 15,
    position: "absolute"
  },
  percentComplete: {
    backgroundColor: "#fff",
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
  mapInternal: {
    height: 150,
    borderColor: "#DBDADA",
    borderWidth: 0.5,
    marginBottom: 5,
    marginTop: 3
  },

  syncHeader: {
    flexDirection: "row",
    alignItems: "stretch",
    flex: 1
  },
  syncHeaderText: {
    paddingTop: 10,
    flex: 1,
    flexDirection: "row"
  },
  wrappedItemsLeft: {
    flex: 0.75
  },
  wrappedItemsLg: {
    flex: 0.9
  },
  wrappedItemsSm: {
    flex: 0.1
  },
  wrappedItemsExLg: {
    flex: 0.91
  },
  wrappedItemsExSm: {
    flex: 0.09
  },
  formArrowCategories: {
    fontSize: 28,
    color: colors.interface.links,
    paddingTop: 4
  },
  formArrow: {
    fontSize: 28,
    color: colors.interface.links,
    paddingTop: 4
  }
});

export { baseStyles, colors, baseText };
