import React from "react";
import { useState, useRef, useEffect } from "react";
import {View, Pressable, StyleSheet, Text, Animated, Image, Easing } from 'react-native'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const  Splash = ({onExit}) => {

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const slideAnim = useRef(new Animated.Value(500)).current;

  const fadeSplash = () => {
    Animated.timing(
        fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }
    ).start();

    Animated.timing(slideAnim,{
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.bezier(0,1.02,.21,.97),
    }).start();
  }

  const hideSplash = () => {
    Animated.timing(
        fadeAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true
        }
    ).start();

    Animated.timing(slideAnim,{
      toValue: -1000,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.bezier(0,1.02,.21,.97),
    }).start(({finished}) => {
      if (finished) {onExit()}
    });
  }

    useEffect(() => {
        fadeSplash();
        setTimeout(() => hideSplash(),2000);
    },[]);

    return (
        <Animated.View style={[{opacity: fadeAnim}, styles.container]}>
            <Animated.View style={{transform: [{translateY: slideAnim}]}}>
                <Image style={styles.image} source={require('../../data/img/logo.png')}/>
            </Animated.View>
        </Animated.View>
    )
}

export default Splash

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1E2132",
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    image: {
        height: 150,
        width: 150
    }
});