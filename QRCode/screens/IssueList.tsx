/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, ScrollView} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface qrcodes {
  _id: string;
  data: string;
  // Add other properties based on your data model
}

function IssueList(): JSX.Element {
  const [data, setData] = useState<qrcodes[]>([]); //initial state to an empty list.
  const [loading, setLoading] = useState(true); //state to indicate if data is being fetched
  const URL = 'http://192.168.1.107:3000/qrCodes';

  useEffect(() => {
    fetch(URL)
      .then(response => response.json())
      .then(json => {
        console.log('fetched data',json);
        setData(json);
        setLoading(false); // Once data is fetched, set loading to false
      })
      .catch(error => {
        console.log('Error fetching data:', error);
        setLoading(false); // Even if there's an error, set loading to false
      });
  }, []); //the [] is to call the function only once when the components mount

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
    <View style={{flex: 1}}>
      <Text style={{color: 'black', fontSize: 50, padding: 20}}>
        QR Codes:
      </Text>

      {data.map(item=>(
        <View style={{margin:20}}>
          <Text style={{color:'black'}} >
            {item.data}
          </Text>
          <QRCode
            key={item._id}
            value={item._id}
            size={300}
            color="white"
            backgroundColor="black"
          />
          </View>
      ))}



    </View>
    </ScrollView>
  );
}

export default IssueList;
