import { connect } from 'react-redux';
import { View, Text, ScrollView, Platform, NativeModules } from 'react-native';
import { useState, useEffect } from 'react';
import { ListItem } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';

//import { StatusBar } from 'expo-status-bar';
//const { StatusBarManager } = NativeModules;
//const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? StatusBar.currentHeight : StatusBarManager.HEIGHT;

function PoiScreen(props) {
   const [pois, setPois] = useState([]);

   useEffect(() => {
      // reading from store and putting in state
      setPois(props.pois);
   }, [props.pois])

   return (
      <SafeAreaView style={{flex:1}}>
         <ScrollView >
            {pois.map((poi, i) => (
               <ListItem key={i} bottomDivider style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <View style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                     <ListItem.Title style={{ textAlign: 'center' }}>{poi.title}</ListItem.Title>
                     <Text>{poi.description}</Text>
                     <Text style={{ fontSize: 11 }}>
                        Latitude: {poi.latitude}
                     </Text>
                     <Text style={{ fontSize: 11 }}>
                        Longitude: {poi.longitude}
                     </Text>
                  </View>
               </ListItem>
            ))}
         </ScrollView>
      </SafeAreaView>
   );
}

function mapStateToProps(state) {
   return {
      user: state.user,
      pois: state.pois
   }
}
export default connect(mapStateToProps, null)(PoiScreen);