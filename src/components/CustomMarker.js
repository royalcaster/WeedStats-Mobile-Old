import React, { useRef, useState } from "react";
import { View, Image, StyleSheet, Text, TouchableNativeFeedback, Animated } from 'react-native'

import ProfileImage from "./ProfileImage";

const CustomMarker = ({ photoUrl, username, type, timestamp }) => {

    return (
        <>
        <View style={styles.container}>
                    <Animated.View style={[styles.image]}>
                        <ProfileImage x={50} url={photoUrl} type={1}/>
                    </Animated.View>
                    <View style={styles.dot}></View>
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 80
    },
    image: {
        width: 57,
        height: 57,
        backgroundColor: "#1E1E1E",
        alignItems: "center",
        borderRadius: 100,
        paddingTop: 3.5,
    },
    dot: {
        width: 10,
        height: 10,
        backgroundColor: "#0080FF",
        borderRadius: 50,
        marginTop: -5,
        alignSelf: "center"
    },
    touchable: {
        width: 60,
        height: 60,
        backgroundColor: "rgba(0,0,0,0.0)",
        borderRadius: 25,
        zIndex: 20
    }
});

export default CustomMarker