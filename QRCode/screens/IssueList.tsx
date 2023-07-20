/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';

interface Issue {
  _id: string;
  title: string;
  // Add other properties based on your data model
}

function IssueList(): JSX.Element {
  const [data, setData] = useState<Issue[]>([]); //initial state to an empty list.
  const [loading, setLoading] = useState(true); //state to indicate if data is being fetched
  const URL = 'http://192.168.1.107:3000/issues';

  useEffect(() => {
    fetch(URL)
      .then(response => response.json())
      .then(json => {
        setData(json);
        setLoading(false); // Once data is fetched, set loading to false
      })
      .catch(error => {
        console.log('Error fetching data:', error);
        setLoading(false); // Even if there's an error, set loading to false
      });
  }, []); //the [] is to call the function only once when the components mount

  if (loading) {
    // Show a loading indicator while data is being fetched
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <Text style={{color: 'black', fontSize: 50, padding: 20}}>
        IssueList:
      </Text>
      {data.map(item => (
        <Text style={{color:'black'}} key={item._id}>{item.title}</Text>
      ))}
    </View>
  );
}

export default IssueList;
