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

import getCurrentPosition from "../../lib/get-current-position";
import { selectOsmFeatures } from "../../selectors";
import { setOsmFeatureList, osm } from "../../actions";
import {
  Annotation,
  Header,
  SideMenu,
  Text,
  Geolocate,
  NearbyFeatures
} from "../../components";
import { baseStyles, colors } from "../../styles";

Mapbox.setAccessToken(
  "pk.eyJ1Ijoic2V0aHZpbmNlbnQiLCJhIjoiSXZZXzZnUSJ9.Nr_zKa-4Ztcmc1Ypl0k5nw"
);

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  buttonAdd: {
    width: 60,
    height: 60,
    borderRadius: 80,
    backgroundColor: "#8212C6",
    zIndex: 10,
    position: "absolute",
    bottom: 95,
    right: 15
  },
  buttonLegend: {
    zIndex: 1002,
    position: "absolute",
    top: 80,
    right: 15,
    zIndex: 10
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
      center: {
        latitude: 47.6685,
        longitude: -122.384
      },
      zoom: 16,
      userTrackingMode: Mapbox.userTrackingMode.followWithHeading,
      annotations: [],
      mapSize: { width: null, height: null },
      userLocation: null
    });

    getCurrentPosition((err, data) => {
      console.log("getCurrentPosition", data);
      this.setState({ userLocation: data.coords });
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

    this._map.getBoundsFromScreenCoordinates(rect, bounds => {
      console.log("bounds from screenCoords", bounds);
      // TODO: trigger action fetching points within bounds
      var q = [[bounds[0], bounds[2]], [bounds[1], bounds[3]]];
      osm.queryOSM(q, (err, results) => {
        console.log("osm.query", err, Object.keys(results));
      });
    });
  };

  onAnnotationPress = e => {
    console.log("onAnnotationPress", console.log(e));
  };

  onStartLoadingMap = e => {
    const { setOsmFeatureList } = this.props;

    this._map.getBounds(data => {
      var q = [[data[0], data[2]], [data[1], data[3]]];

      osm.queryOSM(q, (err, results) => {
        console.log("full results.length", results.length);
        const filtered = results.filter(item => {
          return (
            item.type === "node" &&
            item.lat &&
            item.lon &&
            item.tags &&
            item.tags.name
          );
        });
        console.log("filtered.length", filtered.length);
        setOsmFeatureList(filtered);
      });
    });
  };

  onGeolocate = (err, data) => {
    this.setState({ userLocation: data.coords });

    this._map.setCenterCoordinate(
      data.coords.latitude,
      data.coords.longitude,
      true
    );
  };

  onUpdateUserLocation = e => {
    console.log("e", e);
  };

  render() {
    const { featureList } = this.props;
    console.log("featureList.length", featureList.length);
    const annotations = featureList.map(item => {
      return (
        <Annotation
          key={item.id}
          id={item.id}
          radius={8}
          coordinates={{ latitude: item.lat, longitude: item.lon }}
          onPress={this.onMapPress}
        />
      );
    });
    console.log("annotations.length", annotations.length);
    return (
      <View style={[baseStyles.wrapper, { padding: 0 }]}>
        <Header onTogglePress={this.onMenuPress}>
          <Text>Observe</Text>
        </Header>

        <SideMenu
          ref={menu => {
            this._menu = menu;
          }}
          onSync={this.prepareAnnotations}
        />

        {this.state.showMap &&
          <MapView
            ref={map => {
              this._map = map;
            }}
            style={styles.map}
            annotations={this.state.annotations}
            onFinishLoadingMap={this.prepareAnnotations}
            onTap={this.onMapPress}
            onOpenAnnotation={this.onMapPress}
            onLayout={e => {
              const { nativeEvent: { layout: { height, width } } } = e;
              this.state.mapSize.height = height;
              this.state.mapSize.width = width;
            }}
            onStartLoadingMap={this.onStartLoadingMap}
            onFinishLoadingMap={this.onFinishLoadingMap}
            onUpdateUserLocation={this.onUpdateUserLocation}
            initialCenterCoordinate={this.state.center}
            initialZoomLevel={this.state.zoom}
            initialDirection={0}
            rotateEnabled={false}
            scrollEnabled
            zoomEnabled
            showsUserLocation={false}
            styleURL="https://openmaptiles.github.io/osm-bright-gl-style/style-cdn.json"
            userTrackingMode={this.state.userTrackingMode}
            attributionButtonIsHidden={true}
            logoIsHidden={true}
          >
            {annotations}
          </MapView>}

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

        <Geolocate onGeolocate={this.onGeolocate} />

        <Link to="/add-observation/choose-point" style={[styles.buttonAdd]}>
          <Icon
            name="add"
            style={{
              paddingTop: 10,
              paddingLeft: 10,
              fontSize: 40,
              color: "#ffffff"
            }}
          />
        </Link>

        <NearbyFeatures
          userLocation={this.state.userLocation}
          features={featureList}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  featureList: selectOsmFeatures(state)
});

export default connect(mapStateToProps, {
  setOsmFeatureList
})(ObservationMapScreen);
