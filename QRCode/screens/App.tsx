import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Scanner from './Scanner';
import GenerateQrCode from './GenerateQRCode';
import HomeScreen from './HomeScreen';
import IssueList from './IssueList';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="QRScanner" component={Scanner} />
        <Stack.Screen name="QRGenerator" component={GenerateQrCode} />
        <Stack.Screen name="IssueList" component={IssueList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
