import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { combineReducers}  from 'redux';
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux';
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import ChatScreen from './screens/ChatScreen';
import PoiScreen from './screens/PoiScreen';

import user from './reducers/user.reducer';
import pois from './reducers/pois.reducer';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const store = configureStore({reducer: combineReducers({ user, pois }) });

let TabNavigator = (props) => {
  return (
    <Tab.Navigator initialRouteName={'Map'} screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Map') {
          iconName = 'navigate';
        } else if (route.name === 'Chat') {
          iconName = 'chatbubbles-outline'
        } else if (route.name === 'Interests') {
          iconName = 'information-circle'
        }
        // You can return any component that you like here!
        return <Ionicons name={iconName} size={25} color={color} />;
      },
      tabBarActiveTintColor: '#eb4d4b',
      tabBarInactiveTintColor: '#fff',
      tabBarStyle: {
        backgroundColor: '#130f40',
        padding: 5,
        paddingBottom: 5,
      }
    })}
    >
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name='Interests' component={PoiScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
    </Tab.Navigator>
  )
}

export default function App(props) {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={'Home'} screenOptions={{
          headerShown: false
        }} >
          <Stack.Screen name={'Home'} component={HomeScreen} />
          <Stack.Screen name={'Login'} component={TabNavigator} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
