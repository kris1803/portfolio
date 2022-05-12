import { View, Text, StyleSheet, StatusBar, ImageBackground } from 'react-native';
import { Button, Input } from '@rneui/base';
import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
   },
   backgroundImg: {
      height: '100%',
      width: '100%'
   },
   textInput: {
      color: '#fff',
      height: 50,
      backgroundColor: '#555',
      opacity: 0.5,
      padding: 5,
   }
});

function HomeScreen(props) {
   const [pseudo, setPseudo] = useState('');
   const [alreadyLogin, setAlreadyLogin] = useState(false);
   const [mounted, setMounted] = useState(false);

   useEffect(() => {
      setMounted(true);
      AsyncStorage.getItem('user').then(user => {
         if (user) {
            setPseudo(JSON.parse(user).pseudo);
            setAlreadyLogin(true);
            props.setUser(JSON.parse(user));
         } else {
            setAlreadyLogin(false);
         }
      });

      return () => {
         setMounted(false);
         setAlreadyLogin(false);
         setPseudo('')
      }
   }, [] );

   async function buttonHandlePress() {
      if (pseudo.length > 1 && mounted) {
         // mettre en localstorage le user
         await AsyncStorage.setItem('user', JSON.stringify({ pseudo }));
         props.setUser({ pseudo });
         props.navigation.navigate('Login');
         setMounted(false);
      } else {
         alert('Please enter a pseudo');
      }
   }

   if (!alreadyLogin) {
   return (
      <ImageBackground source={require('../assets/home.jpg')} style={styles.backgroundImg} >
         <View style={styles.container}>
            <Input placeholder={'Username here...'} style={styles.textInput} value={pseudo} onChangeText={(value) => setPseudo(value)} />
            <Button onPress={() => buttonHandlePress()} title={' Go To map '} icon={<Ionicons name="enter" size={24} color={"white"} />} iconRight />

            <StatusBar style="auto" />
         </View>
      </ImageBackground>
   );
   } else {
      return (
         <ImageBackground source={require('../assets/home.jpg')} style={styles.backgroundImg} >
            <View style={styles.container}>
               <Text>Welcome {pseudo}</Text>
               <Button onPress={() => props.navigation.navigate('Login')} title={' Go To map '} icon={<Ionicons name="enter" size={24} color={"white"} />} iconRight />
            
            <StatusBar style="auto" />
            </View>
         </ImageBackground>
      )
   }
}

function mapStateToProps(state) {
   return {
      user: state.user
   }
}
function mapDispatchToProps(dispatch) {
   return {
      setUser: (user) => dispatch({ type: 'SET_USER', user })
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);