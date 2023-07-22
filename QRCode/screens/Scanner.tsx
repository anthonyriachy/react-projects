/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import validateQRCodeAPI from './API';
import { RNCamera } from 'react-native-camera';


function QRCodeScanner(): JSX.Element{
  const [scannedData, setScannedData] = useState<string>('');
  const [validationResult, setValidationResult] = useState<string>('');


  const handleBarCodeScanned = ({ data }: { data: string }) => {
    console.log('scanned QR Code data: ',data)
    setScannedData(data);
    validateQRCode(data);
  };

  const validateQRCode = async (data: string) => {
    try {
      console.log('Sending QR code data:', data);
      const response = await validateQRCodeAPI(data);
      setValidationResult(response.isValid ? 'Valid QR code' : 'Invalid QR code');
    } catch (error) {
      console.error('Error validating QR code:', error);
    }
  };



  return (
    <View style={{ flex: 1 ,backgroundColor:'black'}}>
      <RNCamera
        style={{ flex: 1 }}
        onBarCodeRead={scannedData ? undefined : handleBarCodeScanned}
        captureAudio={false} // Add this line to disable audio recordin
      />
      {scannedData && <Text>Scanned Data: {scannedData}</Text>}
      <Button title="Scan Again" onPress={() => setScannedData('')} />
      {validationResult && <Text>{validationResult}</Text>}
    </View>
  );
}
export default QRCodeScanner;
