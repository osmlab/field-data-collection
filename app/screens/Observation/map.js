import React, { Component } from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import Mapbox, { MapView } from "react-native-mapbox-gl";
import { connect } from "react-redux";
import debounce from "debounce";
import { Link } from "react-router-native";

import Icon from "react-native-vector-icons/MaterialIcons";
import getCurrentPosition from "../../lib/get-current-position";
import {
  selectActiveSurveys,
  selectLoadingStatus,
  selectIsQuerying,
  selectSelectedBounds,
  selectSelectedFeatures,
  selectVisibleFeatures,
  selectVisibleObservations,
  selectVisibleObservationsByNode
} from "../../selectors";
import {
  clearBbox,
  selectBbox,
  setActiveObservation,
  updateVisibleBounds,
  notifyActiveSurveys,
  clearStatus,
  initializeObservation
} from "../../actions";
import {
  AnnotationObservation,
  AnnotationOSM,
  Header,
  SideMenu,
  Text,
  MapOverlay,
  StatusBar
} from "../../components";
import { baseStyles } from "../../styles";
import { colors } from "../../styles";

import config from "../../config";
import LegendModal from "./LegendModal";

Mapbox.setAccessToken(config.mapboxAccessToken);

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  buttonLegend: {
    position: "absolute",
    top: 100,
    right: 10
  },
  header: {
    height: 60,
    paddingLeft: 20,
    flexDirection: "row",
    backgroundColor: "red",
    alignItems: "center",
    zIndex: 1001
  },
  cover: {
    width: 325,
    height: 46
  }
});

class ObservationMapScreen extends Component {
  state = {
    showModal: false,
    pressedFeature: null
  };

  hideModal = () =>
    this.setState({
      showModal: false
    });

  showModal = () =>
    this.setState({
      showModal: true
    });

  componentWillMount() {
    const { clearBbox, notifyActiveSurveys } = this.props;

    this.setState({
      nearbyFeaturesViewOpen: false,
      showMap: true,
      center: {
        latitude: 47.6685,
        longitude: -122.384
      },
      zoom: 16,
      userTrackingMode: Mapbox.userTrackingMode.followWithHeading,
      annotations: [],
      userLocation: null
    });

    clearBbox();
  }

  componentWillUnmount() {
    this.setState({
      showMap: false
    });
  }

  componentWillUpdate(nextProps, nextState) {
    const { history, observations } = this.props;
    const { selectedBounds, selectedFeatures } = nextProps;

    if (selectedFeatures.length > 0 && this._overlay) {
      this._overlay.open();
    }
  }

  onMenuPress = () => {
    this._menu.open();
  };

  onMapPress = e => {
    const {
      history,
      features,
      observations,
      setActiveObservation,
      notifyActiveSurveys
    } = this.props;

    console.log("onMapPress:", e);

    if (e.id != null) {
      console.log("element id:", e.id);
      const [type, id] = e.id.split("-");

      if (type === "observation") {
        const observation = observations.find(o => o.id === id);
        const featureId = observation.tags["osm-p2p-id"];
        const feature = features.find(f => f.id === featureId);
        this.setState({
          pressedFeature: feature
        });
      } else if (type === "feature") {
        const feature = features.find(f => f.id === id);
        if (feature !== null) {
          this.setState({
            pressedFeature: feature
          });
        }
      } else {
        this.setState({
          pressedFeature: null
        });
      }
    }

    const { selectBbox } = this.props;
    const x = e.screenCoordX;
    const y = e.screenCoordY;

    const rect = {
      top: y - 50,
      right: x + 50,
      bottom: y + 50,
      left: x - 50
    };

    this._map.getBoundsFromScreenCoordinates(rect, bounds =>
      selectBbox([bounds[1], bounds[0], bounds[3], bounds[2]])
    );
  };

  onFinishLoadingMap = e => {
    const {
      history,
      clearStatus,
      notifyActiveSurveys,
      activeSurveys
    } = this.props;

    this._mapLoaded = true;

    getCurrentPosition((err, data) => {
      if (data) {
        this.setState({ userLocation: data.coords });
        this.onUpdateBounds();
      }
    });

    const length = activeSurveys.length;

    if (!length) {
      return notifyActiveSurveys(
        <Text>
          <Text style={{ color: "white", fontWeight: "bold" }}>
            No active Surveys
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: 10,
              textDecorationLine: "underline"
            }}
            onPress={() => {
              clearStatus();
              history.push("/account/surveys");
            }}
          >
            Import one now
          </Text>
        </Text>
      );
    }

    const msg =
      length === 1 ? activeSurveys[0].definition.name : `${length} surveys`;

    notifyActiveSurveys(
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Text style={{ color: "white", fontWeight: "bold" }}>Mapping to: </Text>
        <Text style={{ color: "white" }}>
          {msg}
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: 12,
            textDecorationLine: "underline",
            fontStyle: "italic",
            marginLeft: 5,
            marginTop: 3
          }}
          onPress={() => {
            clearStatus();
            history.push("/account/surveys");
          }}
        >
          Change
        </Text>
      </View>
    );
  };

  onRegionDidChange = info => this.onUpdateBounds();

  onGeolocate = (err, data) => {
    if (data) {
      this.setState({ userLocation: data.coords });

      this._map.setCenterCoordinate(
        data.coords.latitude,
        data.coords.longitude,
        true
      );
    }
  };

  onUpdateUserLocation = e => {
    console.log("e", e);
  };

  onUpdateBounds = () => {
    const { updateVisibleBounds } = this.props;

    if (this._map && this._mapLoaded) {
      this._map.getBounds(bounds =>
        // NOTE getBounds returns (lat, lon, lat, lon) so we convert it here
        updateVisibleBounds([bounds[1], bounds[0], bounds[3], bounds[2]])
      );
    }
  };

  setActiveFeature = feature => {
    this.setState({ activeFeature: feature });
  };

  render() {
    const { features, loading, observations, querying } = this.props;
    const { showModal } = this.state;

    let annotations = features.map(item => {
      const active =
        this.state.activeFeature && this.state.activeFeature.id === item.id;

      return (
        <AnnotationOSM
          key={item.id}
          id={`feature-${item.id}`}
          radius={8}
          coordinates={{ latitude: item.lat, longitude: item.lon }}
          onPress={this.onMapPress}
          active={active}
        />
      );
    });

    annotations = annotations.concat(
      observations.map(item => {
        return (
          <AnnotationObservation
            key={item.id}
            id={`observation-${item.id}`}
            owner={item.tags.deviceId}
            coordinates={{ latitude: item.lat, longitude: item.lon }}
            onPress={this.onMapPress}
          />
        );
      })
    );

    return (
      <View style={[baseStyles.wrapper, { padding: 0 }]}>
        <Header onTogglePress={this.onMenuPress}>
          <Text>
            <Image
              style={styles.cover}
              source={{
                uri:
                  "data:image/png;base64,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"
              }}
            />
          </Text>
        </Header>

        <StatusBar />

        <SideMenu
          ref={menu => {
            this._menu = menu;
          }}
          onSync={this.prepareAnnotations}
        />

        <MapView
          ref={map => {
            this._map = map;
          }}
          style={styles.map}
          annotations={this.state.annotations}
          onTap={this.onMapPress}
          onOpenAnnotation={this.onMapPress}
          onFinishLoadingMap={this.onFinishLoadingMap}
          onUpdateUserLocation={this.onUpdateUserLocation}
          onRegionDidChange={debounce(this.onRegionDidChange, 400)}
          initialCenterCoordinate={this.state.center}
          initialZoomLevel={this.state.zoom}
          initialDirection={0}
          rotateEnabled={false}
          scrollEnabled
          zoomEnabled
          showsUserLocation={false}
          styleURL={Mapbox.mapStyles.light}
          userTrackingMode={this.state.userTrackingMode}
          attributionButtonIsHidden={true}
          logoIsHidden={true}
        >
          {annotations}
        </MapView>
        {showModal && <LegendModal close={this.hideModal} />}
        <TouchableOpacity
          style={[styles.buttonLegend]}
          onPress={this.showModal}
        >
          <Icon
            name="info"
            style={{
              paddingTop: 7,
              paddingLeft: 12,
              fontSize: 35,
              color: colors.interface.headerBackground
            }}
          />
        </TouchableOpacity>

        <MapOverlay
          userLocation={this.state.userLocation}
          features={features}
          observations={observations}
          onGeolocate={this.onGeolocate}
          activeSurveys={this.props.activeSurveys}
          areaOfInterest={this.props.areaOfInterest}
          pressedFeature={this.state.pressedFeature}
          initializeObservation={this.props.initializeObservation}
          history={this.props.history}
          loading={loading}
          querying={querying}
          activeFeature={this.setActiveFeature}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  activeSurveys: selectActiveSurveys(state),
  areaOfInterest: state.osm.areaOfInterest,
  features: selectVisibleFeatures(state),
  loading: selectLoadingStatus(state),
  observations: selectVisibleObservations(state),
  querying: selectIsQuerying(state),
  selectedBounds: selectSelectedBounds(state),
  selectedFeatures: selectSelectedFeatures(state)
});

export default connect(mapStateToProps, {
  clearBbox,
  selectBbox,
  setActiveObservation,
  updateVisibleBounds,
  notifyActiveSurveys,
  clearStatus,
  initializeObservation
})(ObservationMapScreen);
