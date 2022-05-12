import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ListItem, Button, Input } from '@rneui/themed';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import socketIOClient from "socket.io-client";

const styles = StyleSheet.create({
   container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
      borderRadius: 10,
   },
   msgContainer: {
      margin: 10,
      marginTop: 40,
      backgroundColor: '#fff',
   },
   sendContainer: {
      margin: 10,
   }
});
// change your ip address here
const LOCAL_IP = 'localhost';

function ChatScreen(props) {
   let socket = socketIOClient("http://" + LOCAL_IP + ":3000");
   const [currentMessage, setCurrentMessage] = useState('');
   const [listMessage, setListMessage] = useState([]);

   let handleButtonPress = () => {
      let msg = {
         content: currentMessage,
         user: props.user.pseudo,
      }
      socket.emit('sendMessage', msg);
      setCurrentMessage('');
   }
   useEffect(() => {
      socket.on('sendMessageToAll', function (message) {
         let mymsg = {
            content: message.content,
            user: message.user,
         }
         let index = mymsg.content.indexOf(':)')
         if (index != -1) {
            mymsg = mymsg.content.replace(':)', '...');
            console.log(mymsg.content);
         }

         setListMessage([...listMessage, mymsg]);

         console.log('message received from back!')
      });
   }, []);

   return (
      <SafeAreaView style={{ flex: 1 }}>
         <View style={styles.container}>
            <ScrollView style={styles.msgContainer}>
               {listMessage.map((l, i) => (
                  <ListItem key={i} bottomDivider style={{ flexDirection: 'column' }}>
                     <ListItem.Title style={{ fontWeight: 'bold' }} >{l.user}</ListItem.Title>
                     <ListItem.Subtitle>{l.content}</ListItem.Subtitle>

                  </ListItem>
               ))}
            </ScrollView>
            <View style={styles.sendContainer} >
               <Input placeholder={'Message...'} value={currentMessage} onChangeText={(text) => setCurrentMessage(text)} />
               <Button buttonStyle={{ backgroundColor: '#eb4d4b' }} title={'Send'} onPress={() => handleButtonPress()} />
            </View>
         </View>
      </SafeAreaView>
   );
}


function mapStateToProps(state) {
   return {
      user: state.user,
   }
}
export default connect(mapStateToProps, null)(ChatScreen);