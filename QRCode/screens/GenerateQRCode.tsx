/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */


import {useEffect, useState} from 'react';
import {View, TextInput, TouchableOpacity, Text} from 'react-native';
import QRCode from 'react-native-qrcode-generator';

export default function GenerateQrCode(): JSX.Element {
  const [input, SetInput] = useState('');
  const [qrValue, SetQrValue] = useState('');


// Function to generate the QR code
const generateQrCode = () => {
  SetQrValue(input || 'NA');
};

//save function to moggodb
const saveQrCodeToMongoDB = async()=>{
  try {
  const response = await fetch('http://192.168.1.107:3000/generate-qrcode',{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
    },
    body:JSON.stringify({data:input}),  
  });
  const data = await response.json();
  SetQrValue(data.dataURL);
  console.log('QR code image saved to mongoDB:',data.dataURL);
}
catch (err){
  console.error('error saving QR code to mongodb',err);
}
};

  return (
    <View>
      <View style={{alignSelf:'center',marginTop:40}}>
      {qrValue ? (
          <QRCode value={qrValue} size={300} color="white" backgroundColor="black" />
        ) : (
          <Text style={{color:'black'}}>No QR Code generated yet</Text>
        )}
      </View>
      <TextInput
        style={{backgroundColor: 'white', color: 'black', marginTop: 40}}
        onChangeText={SetInput}
        value={input}
        placeholder="enter text"
        placeholderTextColor={'grey'}
      />

      <TouchableOpacity
        style={{padding: 20, backgroundColor:'black',marginTop:40}}
        onPress={saveQrCodeToMongoDB}>
        <Text style={{textAlign:'center'}}> Generate a Qr Code</Text>
      </TouchableOpacity>
    </View>
  );
}

