/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import {useRef} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import React from 'react';


interface props{
    Item:{
        qrCodeId:string,
        item:string,
        verify:boolean,
    }
}
export default function Codes({Item}:props): JSX.Element {
  const viewShotRef = useRef<ViewShot>(null); // Create a new ref for the ViewShot component
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
  // const verifyCode = async (item: string) => {
  //   try {
  //     const requestitem = {item: item};
  //     const response = await fetch('http://192.168.1.107:3000/verify-code', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(requestitem),
  //     });
  //     const responseitem = await response.json();
  //     setIsDeleted(true)
  //     console.log(responseitem.message);
  //     return responseitem;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  return (
      <>
        <Text style={{ color: 'black' }}>{Item.item}</Text>
        <ViewShot ref={viewShotRef}>
          <QRCode
            value={Item.qrCodeId}
            size={300}
            color="white"
            backgroundColor="black"
          />
        </ViewShot>
        <View style={{ flexDirection: 'row', gap: 30 }}>
          <TouchableOpacity
            style={{ padding: 20, backgroundColor: 'blue', marginTop: 20, flex: 1 }}
            onPress={takeScreenshot}>
            <Text style={{ textAlign: 'center', color: 'white' }}>Share</Text>
          </TouchableOpacity>
          {/* {Item.verify === false ? (
            <TouchableOpacity
              style={{ padding: 20, backgroundColor: 'green', marginTop: 20, flex: 1 }}
              onPress={() => verifyCode(Item._id)}>
              <Text style={{ textAlign: 'center', color: 'white' }}>
                verify code
              </Text>
            </TouchableOpacity>
          ) : '' } */}
        </View>
      </>
  );
}

