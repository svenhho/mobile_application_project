import React, { useState, useEffect } from 'react';
import MapView, { Callout, Circle, Marker } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default function MapComponent({ latitude, longitude, radius, onUpdateLatitude, onUpdateLongitude }) {
  const [targetPin, setTargetPin] = useState({
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [mapRegion, setMapRegion] = useState({
    latitude: 45.46427,
    longitude: 9.18951,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [yourLocation, setYourLocation] = useState({
    latitude: undefined,
    longitude: undefined,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const userLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access Location was denied')
    }
    let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setYourLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    console.log(location.coords.latitude, location.coords.longitude);
  }

  useEffect(() => {
    userLocation();
  }, []);

  return (
    <View style={styles.mapContainer}>
      <GooglePlacesAutocomplete
        styles={styles.searchbar}
        placeholder='Search'
        fetchDetails={true}
        GooglePlacesSearchQuery={{
          rankby: 'distance'
        }}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          setTargetPin({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          })
          onUpdateLatitude(details.geometry.location.lat);
          onUpdateLongitude(details.geometry.location.lng);
          setMapRegion({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          })
          console.log(data, details);
        }}
        query={{
          key: 'AIzaSyDujB5rNJAvnnrOp965AP5yvXJMdP2_3kY',
          language: 'en',
          components: 'country:it',
          types: 'establishment',
          radius: 30000,
          location: `${mapRegion.latitude}, ${mapRegion.longitude}`
        }}
      />
      <MapView
        style={styles.map}
        region={mapRegion}
        initialRegion={{
          latitude: 45.46427,
          longitude: 9.18951,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        provider="google"
      >
        {yourLocation.latitude !== undefined && (
          <Marker coordinate={yourLocation} title='Marker' pinColor='#ff5b5b'>
            <Callout>
              <Text>Your location</Text>
            </Callout>
          </Marker>)
        }
        {targetPin.latitude !== undefined && (
          <>
            <Marker coordinate={targetPin} title='Target mark' pinColor='#f5a623' draggable={true}
              onDragStart={(e) => { console.log("Drag start", e.nativeEvent.coordinates) }}
              onDragEnd={(e) => {
                setTargetPin({
                  latitude: e.nativeEvent.coordinate.latitude,
                  longitude: e.nativeEvent.coordinate.longitude
                })
                onUpdateLatitude(e.nativeEvent.coordinate.latitude);
                onUpdateLongitude(e.nativeEvent.coordinate.longitude);
              }
              }>
              <Callout>
                <Text>Target area</Text>
              </Callout>
            </Marker>
            <Circle center={targetPin} radius={radius}></Circle>

          </>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '80%',
  },
  map: {
    height: 250,
    backgroundColor: '#F5A623',
  },
  searchbar: {
    container: { flex: 1, position: 'absolute', width: '100%', zIndex: 1 },
    listView: { backgroundColor: 'white' }
  },
  slider: {
    container: { flex: 1, position: 'absolute', width: '100%', zIndex: 1 },
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 40,
  },
  textbox: {
    container: { flex: 1, position: 'absolute', width: '100%', zIndex: 1 },
    width: '90%',
    height: 40,

  },
});