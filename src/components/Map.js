import React, { useState } from "react";
import { useFonts } from "expo-font";
import { StyleSheet, Image, View, Text, Pressable, ScrollView, Dimensions} from 'react-native';


import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Map = () => {

    const windowHeight = Dimensions.get('window').height;

    const [loaded] = useFonts({
        PoppinsBlack: require("./fonts/Poppins-Black.ttf"),
        PoppinsLight: require("./fonts/Poppins-Light.ttf"),
      });

    return (
    <ScrollView style={styles.container}>

        <View style={{height: 20}}></View>
        
        <View style={{alignItems: "center", flex: 1}}>
            
        <MapView
        provider={PROVIDER_GOOGLE}
            initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
            }}
            style={[{height: windowHeight / 10 * 9.6},styles.map]}
        />

        </View>
    </ScrollView>
    )
}

export default Map

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1E1E1E",
        width: "100%"
    },
    heading: {
        fontFamily: "PoppinsBlack",
        fontSize: 18,
        marginLeft: 10,
        color: "#1E1E1E",
        zIndex: 10
    },
    map: {
        width: "100%",
        position: "relative",
        top: -30
    }
});