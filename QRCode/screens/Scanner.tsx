/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useState} from 'react';
import {View, Text} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';

export default function Scanner() {
  const [data, SetData] = useState('scan the items QR code');
  const [verificationResult,SetVerificationResult] = useState(null);

  async function onQRCodeScanned(d:{data:string}){
    SetData(d.data);
    try {
      const response = await fetch(`http://192.168.1.107:3000/verify-qrcode?data=${encodeURIComponent(data)}`);
      const data = await response.json();
      SetVerificationResult(data.message);
    } catch (error) {
      console.error('Error verifying QR code in the database:', error);
    }
  }
  return (
    <QRCodeScanner
      onRead={onQRCodeScanned}
      reactivate={true}
      reactivateTimeout={500}
      topContent={
        <View>
          <Text style={{color:'black' ,backgroundColor:'lightgrey',padding:20,marginBottom:70}}>QRCodeScanner</Text>
        </View>
      }
      showMarker={true}
      bottomContent={
        <View>
          <Text
            style={{
              color: 'black',
              fontSize: 20,
              backgroundColor: 'grey',
              padding:20,
              marginTop:40,
            }}>
            {verificationResult !== null && (
              <Text>{verificationResult ? 'QR Code is valid' : 'QR Code is invalid'}</Text>
            )}
            {data}
          </Text>
        </View>
      }
    />
  );
}
