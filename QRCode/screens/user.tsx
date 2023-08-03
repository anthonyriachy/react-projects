/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const User = () => {
    const [user, setUser] = useState('');
    const [userIsValid,setUserIsValid] = useState<boolean>(false);

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [token, setToken] = useState('');

//   const handle_signUp = async () => {
//     try {
//       if (!email || !password) {
//         console.log('Email and password cannot be empty');
//         return;
//       }

//       const response = await fetch('http://192.168.1.107:3000/signUp', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({email, password}),
//       });
//       const data = await response.json();
//       if (data.token) {
//         setToken(data.token);
//       } else {
//         console.log('Login failed:', data.message);
//       }
//     } catch (error) {
//       console.error('Error during login:', error);
//     }
//   };

//   const handle_signIn = async () => {
//     try {
//       if (!email || !password) {
//         console.log('Email and password cannot be empty');
//         return;
//       }
//       const response = await fetch('http://192.168.1.107:3000/signIn', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({email, password}),
//       });
//       const data = await response.json();
//       if (data.token) {
//         setToken(data.token);
//       } else {
//         console.log('Login failed:', data.message);
//       }


//     } catch (error) {
//       console.error('Error during login:', error);
//     }
//   };

const storeData = async (value:string) => {
  try {
    await AsyncStorage.setItem('my-key', value);
  } catch (e) {
    console.log('error saving:',e);
  }
};

const validateUserAPI = async () => {
  try {
    const response = await fetch('http://192.168.1.107:3000/validate-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({user}),
    });
    let responseData = await response.json();

    if (responseData.isValid){
      console.log(user);
      storeData(user);
    }
    setUserIsValid(responseData.isValid);
  } catch (error){
    console.log('error validating user',error);
    return error;
  }
};
  return (
    <View style={{flex: 1, justifyContent: 'center', padding: 20}}>
      <Text style={{color: 'black'}}>UserName</Text>
        <TextInput
          value={user}
          onChangeText={setUser}
          placeholder="Enter your userName"
          placeholderTextColor={'grey'}
          style={{color: 'black'}}
        />
        <TouchableOpacity
          style={{padding: 20, backgroundColor: 'blue', marginTop: 20}}
          onPress={validateUserAPI}>
          <Text style={{textAlign: 'center', color: 'white'}}>sign in</Text>
        </TouchableOpacity>
    </View>
    //{/* // <View style={{flex: 1, justifyContent: 'center', padding: 20}}>
    //   <Text style={{color: 'black'}}>Email</Text>
    //   <TextInput
    //     value={email}
    //     onChangeText={setEmail}
    //     placeholder="Enter your email"
    //     placeholderTextColor={'grey'}
    //     style={{color: 'black'}}
    //   />
    //   <Text style={{color: 'black'}}>Password</Text>
    //   <TextInput
    //     value={password}
    //     onChangeText={setPassword}
    //     secureTextEntry
    //     placeholder="Enter your password"
    //     placeholderTextColor={'grey'}
    //     style={{color: 'black'}}
    //   />
    //   <TouchableOpacity
    //     style={{padding: 20, backgroundColor: 'blue', marginTop: 160}}
    //     onPress={handle_signUp}>
    //     <Text style={{textAlign: 'center', color: 'white'}}>sign up</Text>
    //   </TouchableOpacity>

    //   <TouchableOpacity
    //     style={{padding: 20, backgroundColor: 'blue', marginTop: 20}}
    //     onPress={handle_signIn}>
    //     <Text style={{textAlign: 'center', color: 'white'}}>sign in</Text>
    //   </TouchableOpacity>
    //   {token ? (
    //     <Text style={{marginTop: 20, color: 'black'}}>
    //       Logged in! Token: {token}
    //     </Text>
    //   ) : null}
    // </View> */}
  );
};

export default User;
