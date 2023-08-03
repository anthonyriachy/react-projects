/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Codes from './QrCode';
import AsyncStorage from '@react-native-async-storage/async-storage';



interface qrcodes {
  _id: string;
  data: string;
  verify: boolean;
  isDeleted: boolean;
}

function QrCodeList(): JSX.Element {


  const [data, setData] = useState<qrcodes[]>([]); //initial state to an empty list.
  const [loading, setLoading] = useState(true); //state to indicate if data is being fetched
  const [user, setUser] = useState<string>(''); //initial state to an empty list.

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('my-key');
        if (value !== null) {
          setUser(value);
        }
      } catch (e) {
        console.log('error reading data:',e);
      }
    };
    getData();

    console.log(user);
    fetch('http://192.168.1.107:3000/qrCodes',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify({user}),
    })
      .then(response => response.json())
      .then(json => {
        console.log('fetched data', json);
        setData(json);
        setLoading(false); // Once data is fetched, set loading to false
      })
      .catch(error => {
        console.log('Error fetching data:', error);
        setLoading(false); // Even if there's an error, set loading to false
      });
  }, [user]); //the [] is to call the function only once when the components mount

  if (loading) {
    // Show a loading indicator while data is being fetched
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={{flex: 1, gap: 40, alignItems: 'center'}}>
        <Text style={{color: 'black', fontSize: 50, padding: 20}}>
          QR Codes:
        </Text>

        {data.map(item => (
          <View key={item._id} style={{justifyContent: 'center'}}>
            <Codes item={item} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export default QrCodeList;
