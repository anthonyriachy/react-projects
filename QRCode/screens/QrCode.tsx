/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import {useRef} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import React from 'react';
import addToUnscannedAPI from '../api/addToUnscanned';


interface props{
    Item:{
        qrCodeId:string,
        owner:string,
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
      await addToUnscannedAPI(Item.owner,Item.qrCodeId);
      await Share.open(shareOptions);
      console.log('beofre sending:',Item.owner,Item.qrCodeId);
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
        </View>
      </>
  );
}

