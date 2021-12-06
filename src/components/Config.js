import React from "react";
import { useFonts } from 'expo-font';
import { StyleSheet, View, Text, Switch, TouchableWithoutFeedbackBase, Image } from 'react-native'

import JointConfigItem from "./JointConfigItem";
import BongConfigItem from "./BongConfigItem";
import VapeConfigItem from "./VapeConfigItem";

const Config = ( { statConfig, toggleConfig }) => {

    const [loaded] = useFonts({
        PoppinsBlack: require('./fonts/Poppins-Black.ttf'),
        PoppinsLight: require('./fonts/Poppins-Light.ttf')
      });
    
      if (!loaded) {
        return null;
      }

    return (
    <View style={styles.container}>

            <View style={{height: 50}}></View>
            <Text style={{
                color: "#a1a1a1",
                fontSize: 25,
                fontFamily: "PoppinsBlack",
                marginLeft: 30
            }}>Ansicht</Text>
            <View style={{height: 10}}></View>

        <JointConfigItem config={statConfig.joint} onToggle={toggleConfig}></JointConfigItem>
        <BongConfigItem config={statConfig.bong} onToggle={toggleConfig}></BongConfigItem>
        <VapeConfigItem config={statConfig.vape} onToggle={toggleConfig}></VapeConfigItem>

    </View>
    );
}

export default Config

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: "#1E1E1E",
        marginTop: 30,
        justifyContent: "center"
    },
    config_text: {
        color: "white",
        fontFamily: "PoppinsLight",
        fontSize: 18,
        alignSelf: "center",
    },
    config_container: {
        flexDirection: "row",
        marginTop: 20
    },
    switch: {
        marginLeft: 20,
        paddingLeft: 20,
    }
});