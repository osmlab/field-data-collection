import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import Mapbox, { MapView } from "react-native-mapbox-gl";
import { connect } from "react-redux";
import debounce from "debounce";

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
  updateVisibleBounds
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

import config from "../../config";

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
  }
});

class ObservationMapScreen extends Component {
  componentWillMount() {
    const { clearBbox } = this.props;

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

    const location = {
      pathname: "/observation/choose-point",
      state: { observations }
    };

    if (selectedFeatures.length > 0) {
      return history.push(location);
    }

    if (selectedBounds !== null) {
      return history.push(location);
    }
  }

  onMenuPress = () => {
    this._menu.open();
  };

  onMapPress = e => {
    const { history, observations, setActiveObservation } = this.props;
    console.log("onMapPress:", e);

    if (e.id != null) {
      console.log("element id:", e.id);
      const [type, id] = e.id.split("-");

      if (type === "observation") {
        console.log("displaying observation", id);
        const observation = observations.find(o => o.id === id);

        if (observation !== null) {
          // TODO: restore ability to press an observation
          // setActiveObservation(observation);
          //
          // return history.push(
          //   `/observation/${observation.tags.surveyId}/${observation.tags
          //     .surveyType}`
          // );
        } else {
          console.warn("Unable to find observation", id);
        }
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
    getCurrentPosition((err, data) => {
      if (data) {
        this.setState({ userLocation: data.coords });
      }
    });

    this.onUpdateBounds();
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

    // NOTE getBounds returns (lat, lon, lat, lon) so we convert it here
    if (this.map) {
      this._map.getBounds(bounds =>
        updateVisibleBounds([bounds[1], bounds[0], bounds[3], bounds[2]])
      );
    }
  };

  setActiveFeature = feature => {
    this.setState({ activeFeature: feature });
  };

  render() {
    const { features, loading, observations, querying } = this.props;

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
            coordinates={{ latitude: item.lat, longitude: item.lon }}
            onPress={this.onMapPress}
          />
        );
      })
    );

    return (
      <View style={[baseStyles.wrapper, { padding: 0 }]}>
        <Header onTogglePress={this.onMenuPress}>
          <Text>Observe</Text>
        </Header>

        <StatusBar />

        <SideMenu
          ref={menu => {
            this._menu = menu;
          }}
          onSync={this.prepareAnnotations}
        />

        {
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
        }

        {/* TODO: restore legend
          <TouchableOpacity
          style={[styles.buttonLegend]}
          onPress={this._onPressButton}
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
        */}

        <MapOverlay
          userLocation={this.state.userLocation}
          features={features}
          observations={observations}
          onGeolocate={this.onGeolocate}
          activeSurveys={this.props.activeSurveys}
          areaOfInterest={this.props.areaOfInterest}
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
  updateVisibleBounds
})(ObservationMapScreen);
