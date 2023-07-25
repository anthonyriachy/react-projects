/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';

interface qrcodes {
  _id: string;
  data: string;
  // Add other properties based on your data model
}

function QrCodeList(): JSX.Element {
  const [data, setData] = useState<qrcodes[]>([]); //initial state to an empty list.
  const [loading, setLoading] = useState(true); //state to indicate if data is being fetched
  
  const viewShotRef = useRef<ViewShot>(null); // Create a new ref for the ViewShot component

  useEffect(() => {
    fetch('http://192.168.1.107:3000/qrCodes')
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
  }, []); //the [] is to call the function only once when the components mount

  if (loading) {
    // Show a loading indicator while data is being fetched
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }
  const shareScreenshot = async (imagePath: string) => {
    try {
      const shareOptions = {
        title: 'Sharing QR Code',
        url: `file://${imagePath}`,
        failOnCancel: false,
      };
      await Share.open(shareOptions);
    } catch (error) {
      console.error('Error sharing screenshot:', error);
    }
  };

  const takeScreenshot = async () => {
    try {
      const uri = await viewShotRef.current?.capture?.();

      if (uri) {
        const imagePath = `${RNFS.DocumentDirectoryPath}/qrCodeScreenshot.png`;
        await RNFS.moveFile(uri, imagePath);
        shareScreenshot(imagePath);
      } else {
        console.warn('Capture method returned undefined');
      }
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    }
  };
  return (
    <ScrollView>
      <View style={{flex: 1,gap:40,alignItems:'center'}}>
        <Text style={{color: 'black', fontSize: 50, padding: 20}}>
          QR Codes:
        </Text>

        {data.map(item => (
          <View key={item._id} style={{justifyContent:'center'}}>
            <Text style={{color: 'black'}}>{item.data}</Text>
            <ViewShot ref={viewShotRef}>
              <QRCode
                value={item._id}
                size={300}
                color="white"
                backgroundColor="black"
              />
            </ViewShot>
            <TouchableOpacity
              style={{padding: 20, backgroundColor: 'blue', marginTop: 20,width:300}}
              onPress={takeScreenshot}>
              <Text style={{textAlign: 'center', color: 'white'}}>
                Take Screenshot & Share
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export default QrCodeList;
