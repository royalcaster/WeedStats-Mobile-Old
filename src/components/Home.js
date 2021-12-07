import React from 'react';
import { Animated, StyleSheet, Text, TouchableWithoutFeedbackBase, View, Image, ScrollView, Pressable } from 'react-native';
import { useFonts } from 'expo-font';
import { useState, useRef } from 'react';

import Stats from './Stats';
import Levels from './Levels';
import Config from './Config';
import Account from './Account';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function Home({ user, statConfig, toggleConfig,  handleLogOut, toggleCounter }) {


  const [view, setView] = useState("stats");

  const [loaded] = useFonts({
    PoppinsBlack: require('./fonts/Poppins-Black.ttf'),
    PoppinsLight: require('./fonts/Poppins-Light.ttf')
  });

  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.container}>

      <View style={styles.content_container}>
        {view == "stats" ? <Stats user={user} statConfig={statConfig} toggleCounter={toggleCounter}/> : null}
        {view == "levels" ? <Levels /> : null}
        {view == "config" ? <Config statConfig={statConfig} toggleConfig={toggleConfig}/> : null}
        {view == "account" ? <Account user={user} handleLogOut={handleLogOut} /> : null}
      </View>

      <View style={styles.footer_container}>
      <View style={styles.options_container}>
        <Pressable onPress={() => {setView("stats")}} style={styles.options_pressable}><Image style={styles.pressable_profileimg} source={view == "stats" ? require('./img/logo.png') : require('./img/logo_bw.png')}/></Pressable>
        <Pressable onPress={() => {setView("levels")}} style={styles.options_pressable}><FontAwesome name='trophy' style={[{color: view == "levels" ? "#e0e0e0" : "#8f8f8f"}, styles.settings_icon]}/></Pressable>
        <Pressable onPress={() => {setView("config")}} style={styles.options_pressable}><FontAwesome name='sliders' style={[{color: view == "config" ? "#e0e0e0" : "#8f8f8f"}, styles.settings_icon]}/></Pressable>
        <Pressable onPress={() => {setView("account")}} style={styles.options_pressable}><FontAwesome name='user' style={[{color: view == "account" ? "#e0e0e0" : "#8f8f8f"}, styles.settings_icon]}/></Pressable>
      </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
        alignItems: 'center',
    },
    header_container: {
        flexDirection: "row",
        width: "100%",
        height: "20%",
        position: "absolute",
        top: 50,
        marginBottom: 20,
        justifyContent: "center"
    },
    main_heading: {
        color: "white",
        fontSize: 30,
        fontFamily: "PoppinsBlack",
    },
    content_container: {
      width: "100%",
      position: "relative",
      height: "93%",
    },
    counters_container: {
        flex: 5,
        backgroundColor: "#1E1E1E",
        width: "100%",
        marginTop: 10,
        height: 200
    },
    main_heading_logo: {
      width: 45,
      height: 45,
      display: "flex",
      marginLeft: 20
    },
    settings_icon_text: {
      flexDirection: "row", 
      marginLeft: "auto", 
      marginRight: 20,
      marginTop: 7,
      paddingLeft: 20,
      paddingRight: 20,
    },
    settings_icon: {
      fontSize: 25,
      textAlign: "center",
      paddingBottom: 0,
      paddingTop: 5,
      marginBottom: 10
    },
    options_container: {
      width: "100%",
      bottom: 0,
      position: "absolute",
      flexDirection: "row",
      maxWidth: 700,
      height: "100%",
    },
    pressable_logo: {
      height: 30,
      width: 30,
      position: "relative",
      marginRight: 5,
      alignSelf: "center",
      marginTop: -5
    },
    options_pressable: {
      flex: 1,
      alignSelf: "center",
      justifyContent: "center",
      height: "100%",
      paddingTop: 5,
      backgroundColor: "#1E1E1E",
      paddingBottom: 10
    },
    options_pressable_close: {
      backgroundColor: "#962020",
      height: 70,
      alignSelf: "center",
      justifyContent: "center",
      borderBottomColor: "#7d7d7d",
      borderBottomWidth: 0.5,
      width: "100%"
    },
    options_pressable_text: {
      alignSelf: "center",
      justifyContent: "center",
      fontSize: 16,
      fontFamily: "PoppinsLight",
      color: "#b8b8b8"
    },
    close_icon: {
      color: "white",
      fontSize: 25,
      alignSelf: "center"
    },
    pressables: {
      width: "100%",
      height: "30%",
      flexDirection: "row"
    },
    pressable_profileimg: {
      height: 40,
      width: 40,
      alignSelf: "center",
      marginBottom: 10
    },
    footer_container: {
      width: "100%",
      height: "7%",
      bottom: 0,
      position: "absolute",
      flexDirection: "row",
      backgroundColor: "#171717",
      justifyContent: "center"
    }
});
