import React, {useEffect, useRef, useState} from "react";
import { Animated, View, StyleSheet, Text } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";

const LoginLine = ({ x1,  y1,  x2,  y2,  stroke,  strokeWidth, delay }) => {

    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 400,
            delay: delay,
            useNativeDriver: true
        }).start()
    },[]);

    return (
        <Animated.View style={{opacity: 1}}>
            <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={strokeWidth}/>
        </Animated.View>
    );
}

export default LoginLine

const styles = StyleSheet.create({
    container: {

    }
});