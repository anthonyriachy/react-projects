/* eslint-disable prettier/prettier */
  /* eslint-disable react-native/no-inline-styles */
  import React, { useEffect, useState } from 'react';
  import { View, Text, TouchableOpacity, Image } from 'react-native';
  import validateQRCodeAPI from './API';
  import { BarCodeReadEvent, RNCamera } from 'react-native-camera';
  import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
  import { launchImageLibrary } from 'react-native-image-picker';
  //import {imageData} from '../api/QrCodeImage';
  import { QRreader } from 'react-native-qr-decode-image-camera';



  function QRCodeScanner(): JSX.Element{
    const [scannedData, setScannedData] = useState<string>('');
    const [validationResult, setValidationResult] = useState<string>('');

    const [selectedImage,setSelectedImage] = useState<string | null>(null);
    const [extractedData, setExtractedData] = useState<string|null>(null);
    useEffect(()=>{
      check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then((result)=>{
        if (result === RESULTS.DENIED){
          request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        }
      });
    },[]);


    const handleBarCodeScanned = ({ data }: BarCodeReadEvent) => {
      console.log('scanned QR Code data: ',data);
      if (data){
        validateQRCode(data);
      }
    };

    const validateQRCode = async (data: string) => {
      try {
        console.log('Sending QR code data:', data);
        const response = await validateQRCodeAPI(data);
        setValidationResult(response.isValid ? 'Valid QR code' : 'Invalid QR code');
        setScannedData(response.qrCodeData);
      } catch (error) {
        console.error('Error validating QR code:', error);
      }
    };
    const getImageData = async (imageUri: string): Promise<string> => {
      try {
        const data = await QRreader(imageUri);
        console.log('QR code data:', data);
        setExtractedData(data);
        return data;
      } catch (error) {
        console.log('Error detecting QR code:', error);
        return '';

      }
    };

    const openImage = () => {
      launchImageLibrary({ mediaType: 'photo' }, async (response) => {
        if (!response.didCancel && response.assets && response.assets.length > 0) {
          const imageUri = response.assets[0].uri ?? '';
          setSelectedImage(imageUri);
          const data = await getImageData(imageUri);
          validateQRCode(data);
        } else {
          console.log('Image selection canceled or no assets selected.');
        }
      });
    };


    return (
      <View style={{ flex: 1 ,backgroundColor:'black'}}>
        <RNCamera
          style={{ flex: 1 }}
          onBarCodeRead={scannedData ? undefined : handleBarCodeScanned}
          captureAudio={false} // Add this line to disable audio recordin
        />
        {scannedData && <Text>Scanned Data: {scannedData}</Text>}
        <TouchableOpacity
          style={{padding: 20, backgroundColor: 'blue', marginTop: 20}}
          onPress={() => setScannedData('')}>
          <Text style={{textAlign: 'center', color: 'white'}}>
              Scan Again
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{padding: 20, backgroundColor: 'blue', marginTop: 20}}
          onPress={()=> openImage()}>
          <Text style={{textAlign: 'center', color: 'white'}}>
              select photo
          </Text>
        </TouchableOpacity>
        {validationResult && <Text>{validationResult}</Text>}
        {selectedImage &&
          <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200 }} />
        }

      </View>
    );
  }
  export default QRCodeScanner;
