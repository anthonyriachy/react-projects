/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

type props={
    navigation:NavigationProp<any>
}

export default function HomeScreen({ navigation }:props): React.JSX.Element {
    return (
        <View style={style.styleContainer}>
            <View>
                <TouchableOpacity style={style.styleButton} onPress={()=>navigation.navigate('QRScanner')}>
                    <Text style={{color:'white'}}>Scan QR Code</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity style={style.styleButton} onPress={()=>navigation.navigate('QRGenerator')}>
                    <Text style={{color:'white'}}>Generate QR Code</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity style={style.styleButton} onPress={()=>navigation.navigate('QrCodeList')}>
                    <Text style={{color:'white'}}>Qr Code List</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    styleButton:{
        backgroundColor:'grey',
        color:'white',
        padding:20,
        alignItems:'center',
        shadowColor:'black',
        elevation:20,
    },
    styleContainer:{
        flex:1,
        backgroundColor:'white',
        gap:60,
        padding:20,
        justifyContent:'center',
    },
}
);

