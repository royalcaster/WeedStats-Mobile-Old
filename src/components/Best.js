import React, {useEffect, useRef, useState} from "react";
import { Animated, View, StyleSheet, Text, Easing } from "react-native";
import LevelImage from "./LevelImage";
import { LinearGradient } from "expo-linear-gradient";

const Best = ({ colors, level_index, title}) => {

    const scale_anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(scale_anim,
            {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.bezier(0, 1.02, 0.21, 0.97)
            }    
        ).start();
    });

    return (
        <Animated.View style={[styles.container,{transform: [{scale: scale_anim}]}]}>
                <LinearGradient colors={colors} style={[styles.activity_container,{height: 80}]}>
                  <LevelImage index={level_index} style={{marginTop: -10, marginLeft: -20}}/>
                  <Text style={{color: "white", fontSize: 18, fontFamily: "PoppinsBlack"}}>{title}</Text>
                </LinearGradient>
        </Animated.View>
    );
}

export default Best

const styles = StyleSheet.create({
    container: {

    },
    activity_container: {
        backgroundColor: "#1E1E1E",
        borderRadius: 25,
        flexDirection: "row",
        width: "70%",
        alignItems: "center",
        alignContent: "center",
        alignSelf: "center",
      },
});