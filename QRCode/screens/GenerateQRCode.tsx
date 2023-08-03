/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';
import AsyncStorage from '@react-native-async-storage/async-storage';


const GenerateQrCode = () => {
  //const [input, setInput] = useState<string>('');
  const [item, setItem] = useState<string>('');
  const [numberOfItems, setNumberOfItems] = useState<string>('');
  const [qrValue, setQrValue] = useState<string>('');
  const viewShotRef = useRef<ViewShot>(null); // Create a new ref for the ViewShot component
  const [user, setInputUser] = useState<string>('');
  const [userIsValid, setUserIsValid] = useState<boolean>(false);
  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('my-key');
        if (value !== null) {
          setInputUser(value);
        }
      } catch (e) {
        console.log('error reading data:', e);
      }
    };
    getData();
  }, []);

  const validateUserAPI = async () => {
    try {
      const response = await fetch('http://192.168.1.107:3000/validate-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({user}),
      });
      const responseData = await response.json();
      console.log('response data', responseData);

      setUserIsValid(responseData.isValid);
    } catch (error) {
      console.log('error validating user', error);
      return error;
    }
  };

  // const generateQRCodeAPI = async (data: string, qrtype: string) => {
  //   try {
  //     const response = await fetch(
  //       'http://192.168.1.107:3000/generate-qrcode',
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({data, qrtype, user}),
  //       },
  //     );

  //     if (!response.ok) {
  //       throw new Error('Failed to generate QR code');
  //     }

  //     const responseData = await response.json();
  //     return responseData.qrCode; // Extract the QR code value from the response
  //   } catch (error) {
  //     console.error('Error generating QR code:', error);
  //     throw error;
  //   }
  // };

  const addItemAPI = async () => {
    try {
      const response = await fetch('http://192.168.1.107:3000/add-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({numberOfItems, item, user}),
      });
      const responseData = await response.json();

      console.log('rsponse:',responseData);
      return responseData.qrCode;
    } catch (e) {
      console.log(e);
    }
  };

  const saveQrCodeToMongoDB = async () => {
    try {
      const qrCodeValue = await addItemAPI();
      setQrValue(qrCodeValue); // Set the generated QR code value
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

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
        // Save the image to the device's local storage
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
      <View>
        <View style={{alignSelf: 'center', marginTop: 40}}>
          <ViewShot ref={viewShotRef}>
            {qrValue ? (
              <QRCode
                value={qrValue}
                size={300}
                color="white"
                backgroundColor="black"
              />
            ) : (
              <Text style={{color: 'black'}}>
                No QR Code generated yet,{user}
              </Text>
            )}
          </ViewShot>
        </View>
        {!userIsValid ? (
          <>
            <TextInput
              style={{backgroundColor: 'white', color: 'black', marginTop: 40}}
              onChangeText={setInputUser}
              value={user}
              placeholder="enter user name"
              placeholderTextColor={'grey'}
            />
            <TouchableOpacity
              style={{padding: 20, backgroundColor: 'black', marginTop: 40}}
              onPress={() => validateUserAPI()}>
              <Text style={{textAlign: 'center', color: 'white'}}>
                Continue
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <></>
        )}

        {userIsValid ? (
          <>
            <TextInput
              style={{backgroundColor: 'white', color: 'black', marginTop: 40}}
              onChangeText={setItem}
              value={item}
              placeholder="enter item name"
              placeholderTextColor={'grey'}
            />
            <TextInput
              style={{backgroundColor: 'white', color: 'black', marginTop: 40}}
              onChangeText={setNumberOfItems}
              value={numberOfItems}
              placeholder="enter item name"
              placeholderTextColor={'grey'}
            />

            <TouchableOpacity
              style={{padding: 20, backgroundColor: 'black', marginTop: 40}}
              onPress={() => saveQrCodeToMongoDB('item')}>
              <Text style={{textAlign: 'center', color: 'white'}}>
                generate the qr code
              </Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={{padding: 20, backgroundColor: 'black', marginTop: 40}}
              onPress={() => saveQrCodeToMongoDB('offer')}>
              <Text style={{textAlign: 'center', color: 'white'}}>
                Generate a Qr Code for a offer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{padding: 20, backgroundColor: 'black', marginTop: 40}}
              onPress={() => saveQrCodeToMongoDB('item')}>
              <Text style={{textAlign: 'center', color: 'white'}}>
                Generate a Qr Code a shop item
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{padding: 20, backgroundColor: 'black', marginTop: 40}}
              onPress={() => saveQrCodeToMongoDB('deal')}>
              <Text style={{textAlign: 'center', color: 'white'}}>
                Generate a Qr Code for one time deal
              </Text>
            </TouchableOpacity> */}
          </>
        ) : (
          <></>
        )}
        {qrValue ? (
          <TouchableOpacity
            style={{padding: 20, backgroundColor: 'blue', marginTop: 20}}
            onPress={takeScreenshot}>
            <Text style={{textAlign: 'center', color: 'white'}}>
              Take Screenshot & Share
            </Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
    </ScrollView>
  );
};

export default GenerateQrCode;
