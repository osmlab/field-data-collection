import React, { Component } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { NavigationActions } from "react-navigation";
import Mapbox, { MapView } from "react-native-mapbox-gl";

import { Text, Wrapper } from "../../components";
import { baseStyles } from "../../styles";

const styles = StyleSheet.create({
  map: {
    flex: 1
  }
});

class LocationScreen extends Component {
  componentWillMount() {
    //   const { navigation: { state: { params: { fieldset } } } } = this.props;
    //
    //   this.setState({
    //     fieldset
    //   });
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={[baseStyles.wrapper, { padding: 0 }]}>
        <MapView
          ref={map => {
            this._map = map;
          }}
          style={styles.map}
          // initialCenterCoordinate={this.state.center}
          // initialZoomLevel={this.state.zoom}
          initialDirection={0}
          rotateEnabled={false}
          scrollEnabled
          zoomEnabled
          showsUserLocation={false}
          styleURL={Mapbox.mapStyles.light}
        />
      </View>
    );
  }
}

export default LocationScreen;
