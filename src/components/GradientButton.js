import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing, TouchableNativeFeedback } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import Ripple from 'react-native-material-ripple';

const GradientButton = ({icon, title, color, hovercolor, borderradius, onPress, fontColor}) => {
        
    return (
    <View style={[{borderRadius: borderradius},styles.container]}>
        <TouchableNativeFeedback
            onPress={() => {
            onPress();
            }}
            background={TouchableNativeFeedback.Ripple("rgba(255,255,255,0.5)", true)} 
            style={{height: "100%", width: "100%"}}
        >
        <View style={styles.touchable}>
            <LinearGradient colors={["#0080FF", "#0060BF"]} style={{width: "100%", zIndex: 0}}>
                <Text>{icon}</Text>
                <Text style={[{color: fontColor},styles.title]}> {title}</Text>
            </LinearGradient>
        </View>
        </TouchableNativeFeedback>
    </View>
    );
}

export default GradientButton

const styles = StyleSheet.create({
    container: {
        height: 50,
        width: "80%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        alignSelf: "center"
    },
    title: {
        fontSize: 16,
        fontFamily: "PoppinsLight",
        zIndex: 6,
        marginTop: 3
    },
    touch: {
        width: "100%",
        height: 100,
        borderRadius: 100,
        backgroundColor: "green",
        position: "absolute",
        zIndex: 5
    },
    touchable: {
      height: "100%",
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      zIndex: 1
    }
});