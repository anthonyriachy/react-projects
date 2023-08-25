/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import { Int32 } from 'react-native/Libraries/Types/CodegenTypes';


function RedeemPoints() {
  const [user,setUser] = useState<string>('');
  const [isValid,setIsValid] = useState<string>('');

  useEffect(()=>{
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('my-key');
        if (value !== null) {
          setUser(value);
        }
      } catch (e) {
        console.log('error reading data:',e);
      }
    };
    getData();
  },[user]);



  const redeemPointsAPI = async (numberOfPoints:Int32)=>{
    try {
      const response = await fetch('http://192.168.1.107:3000/redeem_points',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({points:numberOfPoints,user}),
      });
      const Valid = await response.json();
      console.log('is valid:',Valid)
      setIsValid(Valid.isValid);
    } catch (err){
      console.log(err);
    }
  };


  return (
    <>
      <View>
        <TouchableOpacity style={style.styleButton} onPress={()=>redeemPointsAPI(500)}>
        <Text style={{color: 'white',fontSize:30}}>5 $</Text>
          <Text style={{color: 'white'}}>500 points</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity style={style.styleButton} onPress={()=>redeemPointsAPI(1000)}>
        <Text style={{color: 'white',fontSize:30}}>10 $</Text>
          <Text style={{color: 'white'}}>1000 Points</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity style={style.styleButton} onPress={()=>redeemPointsAPI(2500)}>
        <Text style={{color: 'white',fontSize:30}}>25 $</Text>
          <Text style={{color: 'white'}}>2,500 Points</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity style={style.styleButton} onPress={()=>redeemPointsAPI(5000)}>
        <Text style={{color: 'white',fontSize:30}}>50 $</Text>
          <Text style={{color: 'white'}}>5,000 Points</Text>
        </TouchableOpacity>
      </View>
    {isValid ?
      <View>
        <Text style={{color:'black',fontSize:20}} > {isValid}</Text>
      </View> :
      <></>
      }
    </>
  );
}

const style = StyleSheet.create({
  styleButton: {
    backgroundColor: 'grey',
    color: 'white',
    padding: 20,
    alignItems: 'center',
    shadowColor: 'black',
    elevation: 20,
  },
  styleContainer: {
    flex: 1,
    backgroundColor: 'white',
    gap: 60,
    padding: 20,
    justifyContent: 'center',
  },
});

export default RedeemPoints;
