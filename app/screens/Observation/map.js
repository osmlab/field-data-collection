import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import Mapbox, { MapView } from "react-native-mapbox-gl";
import { connect } from "react-redux";
import debounce from "debounce";

import getCurrentPosition from "../../lib/get-current-position";
import {
  selectObservations,
  selectActiveSurveys,
  selectSelectedFeatures
} from "../../selectors";
import { selectBbox, updateVisibleBounds } from "../../actions";
import {
  AnnotationObservation,
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
    this.setState({
      nearbyFeaturesViewOpen: false,
      showMap: true,
      mapLoaded: false,
      center: {
        latitude: 47.6685,
        longitude: -122.384
      },
      zoom: 16,
      userTrackingMode: Mapbox.userTrackingMode.followWithHeading,
      annotations: [],
      userLocation: null
    });
  }

  componentWillUnmount() {
    this.setState({
      showMap: false
    });
  }

  onMenuPress = () => {
    this._menu.open();
  };

  onMapPress = e => {
    const { selectBbox } = this.props;
    const x = e.screenCoordX;
    const y = e.screenCoordY;

    const rect = {
      top: y - 50,
      right: x + 50,
      bottom: y + 50,
      left: x - 50
    };

    this._map.getBoundsFromScreenCoordinates(rect, selectBbox);
  };

  onFinishLoadingMap = e => {
    const { updateVisibleBounds } = this.props;
    this.setState({
      mapLoaded: true
    });

    getCurrentPosition((err, data) => {
      if (data) {
        this.setState({ userLocation: data.coords });
      }
    });

    this._map.getBounds(updateVisibleBounds);
  };

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

  render() {
    const {
      featureList,
      observations,
      selectedFeatures,
      updateVisibleBounds
    } = this.props;

    console.log("selectedFeatures:", selectedFeatures);

    // let annotations = featureList.map(item => {
    //   return (
    //     <AnnotationOSM
    //       key={item.id}
    //       id={item.id}
    //       radius={8}
    //       coordinates={{ latitude: item.lat, longitude: item.lon }}
    //       onPress={this.onMapPress}
    //     />
    //   );
    // });
    //
    // annotations = annotations.concat(
    //   observations.map(item => {
    //     return (
    //       <AnnotationObservation
    //         key={item.id}
    //         id={item.id}
    //         coordinates={{ latitude: item.lat, longitude: item.lon }}
    //         onPress={this.onMapPress}
    //       />
    //     );
    //   })
    // );

    let annotations = observations.map(item => {
      return (
        <AnnotationObservation
          key={item.id}
          id={item.id}
          coordinates={{ latitude: item.lat, longitude: item.lon }}
          onPress={this.onMapPress}
        />
      );
    });

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
            onRegionDidChange={debounce(updateVisibleBounds, 400)}
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
          features={featureList}
          onGeolocate={this.onGeolocate}
          activeSurveys={this.props.activeSurveys}
          areaOfInterest={this.props.areaOfInterest}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  observations: selectObservations(state),
  areaOfInterest: state.osm.areaOfInterest,
  activeSurveys: selectActiveSurveys(state),
  selectedFeatures: selectSelectedFeatures(state)
});

export default connect(mapStateToProps, {
  selectBbox,
  updateVisibleBounds
})(ObservationMapScreen);
