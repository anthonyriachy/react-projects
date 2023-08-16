/* eslint-disable prettier/prettier */
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Scanner from './Scanner';
import GenerateQrCode from './GenerateQRCode';
import HomeScreen from './HomeScreen';
import QrCodeList from './QrCodeList';
import RedeemPoints from './RedeemPoints'
import User from './user';
import { UserProvider } from './UserContext';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <UserProvider>

    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen name="User" component={User} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="QRScanner" component={Scanner} />
        <Stack.Screen name="QRGenerator" component={GenerateQrCode} />
        <Stack.Screen name="QrCodeList" component={QrCodeList} />
        <Stack.Screen name="RedeemPoints" component={RedeemPoints}/>
      </Stack.Navigator>
    </NavigationContainer>
    </UserProvider>
  );
}

export default App;
