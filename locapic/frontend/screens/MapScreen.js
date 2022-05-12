import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { connect } from 'react-redux';
import * as Location from 'expo-location';
import { Button, Overlay, Input } from '@rneui/themed';
import { Foundation } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
   },
   map: {
      flex: 1,
      width: '100%',
   },
   buttonContainer: {
      padding: 5,
      width: '100%',
   },
   button: {
      backgroundColor: '#eb4d4b',
      height: 50,
      fontSize: 24,
      width: '100%',
   }
});

function MapScreen(props) {
   
   const defaultLocation = {
      coords: {
         latitude: 48.866667,
         longitude: 2.333333,
      }
   }
   // ititialize the location to Paris until the user is found
   const [location, setLocation] = useState(defaultLocation);
   const [addPOI, setAddPOI] = useState(false); // state to disable button when adding poi to map
   const [listPOI, setListPOI] = useState([]);
   const [markers, setMarkers] = useState([]); // state with all markers as components
   const [visible, setVisible] = useState(false);
   const [watcher, setWatcher] = useState(null);
   const [title, setTitle] = useState('');
   const [description, setDescription] = useState('');

   const toggleOverlay = () => {
      setVisible(!visible);
   };

   useEffect(() => {
      (async () => {
         let { status } = await Location.requestForegroundPermissionsAsync();
         if (status !== 'granted') {
            alert('Permission to access location was denied');
            return;
         }

         let location = await Location.getCurrentPositionAsync({});
         let locationwatcher = await Location.watchPositionAsync({ distanceInterval: 2 }, (loc) => {
            setLocation(loc);
         })
         // putting location watcher function in state to be able to cancel it when component unmounts
         setWatcher(locationwatcher);
         // updating user location to show on map
         setLocation(location);
         // get pois from storage and set markers on map
         AsyncStorage.getItem('pois', function (err, data) {
            if (err) { console.log(err);
            } else {
               if (data) {
                  let pois = JSON.parse(data);
                  console.log('pois length is ', pois.length)
                  // adding pois to store one by one
                  for (let i=0; i<pois.length; i++) {
                     props.addPoi(pois[i]);
                  }
                  // putting pois in state to be able to display them on map
                  setListPOI(pois);
               }
            }
         });
      })();
      alert("Welcome, " + props.user.pseudo)

      // component destroy function, stop watching position on unmounted component
      return async () => {
         if(watcher) {
            await watcher.remove();
         }
      }
   }, []);

   useEffect(() => {
      console.log('running useEffect for listPOI');
      let newCoords = [...listPOI];
      let newMarkers = [];
      if (listPOI.length !== 0) {
         for (let i=0; i<newCoords.length; i++) {
            newMarkers.push(<Marker key={i} coordinate={{ latitude: newCoords[i].latitude, longitude: newCoords[i].longitude }} pinColor={'blue'} title={newCoords[i].title} description={newCoords[i].description} />)
         }
      }
      setAddPOI(false);
      setMarkers(newMarkers);
   }, [listPOI])

   let buttonHandlePress = () => {
      setVisible(!visible);
      setAddPOI(!addPOI);
   }

   let handleMapPress = (e) => {
      if (addPOI) {
         let coords = e.nativeEvent.coordinate;
         coords.title = title;
         coords.description = description;
         let newCoords = [...listPOI, coords];
         let poiToSave = {
            title: title,
            description: description,
            latitude: coords.latitude,
            longitude: coords.longitude
         }
         // read the pois from the storage and if exist, do add.poi for each of them and save the new one
         AsyncStorage.getItem('pois').then((value) => {
            if (value !== null) {
               let pois = JSON.parse(value);
               for (let i=0; i<pois.length; i++) {
                  props.addPoi(pois[i]);
               }
               pois.push(poiToSave);
               AsyncStorage.setItem('pois', JSON.stringify(pois));
            } else {
               let pois = [];
               pois.push(poiToSave);
               AsyncStorage.setItem('pois', JSON.stringify(pois));
            }
         })

         props.addPoi(poiToSave);
         setListPOI(newCoords);
      }
   }
   let handleConfirmButton = () => {
      console.log('confirm button pressed');
   }

   return (
      <SafeAreaView style={{flex:1}}>
      <View style={styles.container} >
         <MapView style={styles.map}
            initialRegion={{
               latitude: 48.866667,
               longitude: 2.333333,
               latitudeDelta: 0.0922,
               longitudeDelta: 0.0421,
            }}
            onPress={(e) => handleMapPress(e)}
         >
            {/* default marker of user's position */}
            <Marker coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }}
               title="Hello"
               description="I am here"
               draggable  // Rendre le marqueur drag & dropable
               opacity={0.8}  // Modifier l'opacité
            />
            {markers}
         </MapView>
         <Overlay isVisible={visible} onBackdropPress={() => { toggleOverlay(); setAddPOI(false) }} overlayStyle={{ width: '80%' }}>
            <Text style={{ textAlign: 'center', fontSize: 18 }}>Mettez les informations.</Text>
            <Input placeholder="Title" style={{ width: '100%' }} value={title} onChangeText={(text) => setTitle(text)} />
            <Input placeholder="Description" style={{ width: '100%' }} onChangeText={(text) => setDescription(text)} />
            <Button
               title="Place on map"
               onPress={() => { toggleOverlay(); handleConfirmButton() }}
               inputStyle={{ width: '100%', flex: 1 }}

            />
         </Overlay>
         <View style={styles.buttonContainer}>
            <Button title={'Add POI '} disabled={addPOI} buttonStyle={styles.button} iconRight icon={<Foundation name="marker" size={24} color="white" />} onPress={() => buttonHandlePress()} />
         </View>
      </View>
      </SafeAreaView>
   );
}

function mapStateToProps(state) {
   return {
      user: state.user,
      pois: state.pois
   }
}
function mapDispatchToProps(dispatch) {
   return {
      setUser: (user) => dispatch({ type: 'SET_USER', user }),
      addPoi: (poi) => dispatch({ type: 'ADD_POI', poi })
   }
}
export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
