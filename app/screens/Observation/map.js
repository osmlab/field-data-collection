import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Button,
  Dimensions,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import Mapbox, { MapView } from "react-native-mapbox-gl";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Link } from "react-router-native";
import { connect } from "react-redux";
import debounce from "debounce";

import getCurrentPosition from "../../lib/get-current-position";
import { selectOsmFeatures, selectObservations } from "../../selectors";
import { setOsmFeatureList, setObservations, osm } from "../../actions";
import {
  AnnotationOSM,
  AnnotationObservation,
  Header,
  SideMenu,
  Text,
  Geolocate,
  MapOverlay,
  StatusBar
} from "../../components";
import { baseStyles, colors } from "../../styles";

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
    const x = e.screenCoordX;
    const y = e.screenCoordY;

    const rect = {
      top: y - 50,
      right: x + 50,
      bottom: y + 50,
      left: x - 50
    };

    // this._map.getBoundsFromScreenCoordinates(rect, bounds => {
    //   var q = [[bounds[0], bounds[2]], [bounds[1], bounds[3]]];
    //
    //   osm.queryOSM(q, (err, results) => {
    //     console.log("osm.query", err, Object.keys(results));
    //   });
    // });
  };

  setFeatures = e => {
    // make sure map is loaded before trying to get bounds
    if (!this.state.mapLoaded) return;

    const { setOsmFeatureList, setObservations } = this.props;

    this._map.getBounds(data => {
      var q = [[data[0], data[2]], [data[1], data[3]]];

      osm.queryObservations(q, (err, observations) => {
        if (err) console.log(err);

        osm.queryOSM(q, (err, nodes) => {
          if (err) console.log(err);
          // TODO: replace this with filtering based on presets
          const filtered = nodes.filter(item => {
            return (
              item.type === "node" &&
              item.lat &&
              item.lon &&
              item.tags &&
              item.tags.name
            );
          });

          setOsmFeatureList(filtered);
          setObservations(observations);
        });
      });
    });
  };

  onFinishLoadingMap = e => {
    this.setState({
      mapLoaded: true
    });

    getCurrentPosition((err, data) => {
      if (data) {
        this.setState({ userLocation: data.coords });
      }
    });

    this.setFeatures();
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
    const { featureList, observations } = this.props;

    let annotations = featureList.map(item => {
      return (
        <AnnotationOSM
          key={item.id}
          id={item.id}
          radius={8}
          coordinates={{ latitude: item.lat, longitude: item.lon }}
          onPress={this.onMapPress}
        />
      );
    });

    annotations = annotations.concat(
      observations.map(item => {
        return (
          <AnnotationObservation
            key={item.id}
            id={item.id}
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
            onRegionDidChange={debounce(this.setFeatures, 400)}
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

        <MapOverlay
          userLocation={this.state.userLocation}
          features={featureList}
          onGeolocate={this.onGeolocate}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  featureList: selectOsmFeatures(state),
  observations: selectObservations(state)
});

export default connect(mapStateToProps, {
  setOsmFeatureList,
  setObservations
})(ObservationMapScreen);
