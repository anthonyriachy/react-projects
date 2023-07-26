/* eslint-disable prettier/prettier */
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Scanner from './Scanner';
import GenerateQrCode from './GenerateQRCode';
import HomeScreen from './HomeScreen';
import QrCodeList from './QrCodeList';
import User from './user';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen name="User" component={User} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="QRScanner" component={Scanner} />
        <Stack.Screen name="QRGenerator" component={GenerateQrCode} />
        <Stack.Screen name="QrCodeList" component={QrCodeList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
