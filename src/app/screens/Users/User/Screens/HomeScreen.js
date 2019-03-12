import React, { Component } from "react";
import { View, Text, StyleSheet, StatusBar, SafeAreaView } from "react-native";

import { Button } from "react-native-elements";

import { connect } from "react-redux";
import {
  setGpsOn,
  setCoords
} from "../../../../redux/actions/LocalLocationActions";

import Icon from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

import NetworkOverlay from "../../NetworkOverlay";
import FloatingHeaderBar from "../../../../components/FloatingHeaderBar";

import { getCurrentLocation } from "../../../../components/Location/getCurrentLocation";

import {
  latitudeDelta,
  longitudeDelta,
  latitude,
  longitude
} from "../../../../redux/reducers/LocalLocation";

class HomeScreen extends Component {
  static navigationOptions = {
    drawerIcon: ({ tintColor }) => (
      <Icon name="home" color={tintColor} size={20} />
    )
  };
  state = {
    region: {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: latitudeDelta,
      longitudeDelta: longitudeDelta
    }
  };
  componentDidMount() {}
  componentDidUpdate(prevProps) {}
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor="rgba(0,0,0,0)"
          barStyle="dark-content"
          translucent={true}
        />

        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          ref={ref => {
            this.map = ref;
          }}
          initialRegion={this.state.region}
          showsUserLocation
          showsBuildings={true}
          onUserLocationChange={e => {
            this.props.dispatch(setGpsOn());
            this.props.dispatch(setCoords(e.nativeEvent.coordinate));
          }}
        />
        <FloatingHeaderBar {...this.props} />
        <View style={styles.fabs}>
          <Button
            type="clear"
            icon={
              <MaterialIcons
                name={this.props.localLocation.icon}
                size={25}
                color="black"
                style={{
                  backgroundColor: "white",
                  padding: 15,
                  borderRadius: 35,
                  elevation: 10
                }}
              />
            }
            onPress={() => {
              getCurrentLocation(this.props);
              if (this.props.localLocation.coords != null) {
                this.map.animateToRegion(
                  {
                    ...this.state.region,
                    latitude: this.props.localLocation.coords.latitude,
                    longitude: this.props.localLocation.coords.longitude
                  },
                  1000
                );
              }
            }}
          />
          <Button
            type="clear"
            icon={
              <MaterialIcons
                name={"play-for-work"}
                size={25}
                color="black"
                style={{
                  backgroundColor: "white",
                  padding: 15,
                  borderRadius: 35,
                  elevation: 10
                }}
              />
            }
            onPress={() => {
              this.props.navigation.navigate("Request");
            }}
          />
        </View>
        {/* <NetworkOverlay /> */}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    overlays: state.overlays,
    localLocation: state.localLocation
  };
};
export default connect(mapStateToProps)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  fabs: {
    position: "absolute",
    bottom: 10,
    right: 10
  }
});
