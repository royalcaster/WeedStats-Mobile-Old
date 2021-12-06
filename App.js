import { StatusBar } from 'expo-status-bar';
import React from 'react'
import { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedbackBase, View } from 'react-native';
import { useFonts } from 'expo-font';
import Home from './src/components/Home';
import Login from './src/components/Login';

import { Linking } from 'expo';

export default function App() {

//const prefix = Linking.createURL('exp://127.0.0.1:19000');
// Expo Go: `exp://ADDRESS:PORT`


/* useEffect(() => {
  (async () => {
    let cachedAuth = await getCachedAuthAsync();
    if (cachedAuth && !authState) {
      setAuthState(cachedAuth);
    }
  })();
}, []); */

/* const handleLogin = async () => {
  await GoogleSignin.hasPlayServices()
  const userInfo = await GoogleSignin.signIn();
  setUser(userInfo);
} */

//user-objekt, hier backend anknüpfen
const [user, setUser] = useState({
  username: "royalcaster",
  email: "gabriel.pechstein@schneeberg.km3.de",
  membersince: "21. August 2021",
  joint_counter: 28,
  bong_counter: 305,
  vape_counter: 420,
});

const [statConfig, setStatConfig] = useState({
  joint: false,
  bong: true,
  vape: true
});

const toggleConfig = (index) => {
  switch(index){
    case 1: setStatConfig({...statConfig, joint: !statConfig.joint}); break;
    case 2: setStatConfig({...statConfig, bong: !statConfig.bong}); break;
    case 3: setStatConfig({...statConfig, vape: !statConfig.vape}); break;
  }
}

/* useEffect(() => { 
  firebase.auth().onAuthStateChanged((user) => {
    handleLogin(user);
  })
}, []); */



  const [loaded] = useFonts({
    PoppinsBlack: require('./assets/fonts/Poppins-Black.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (<>{user ? <Home user={user} statConfig={statConfig} toggleConfig={toggleConfig}/> : <Login handleLogin={handleLogin}/>}</>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
});