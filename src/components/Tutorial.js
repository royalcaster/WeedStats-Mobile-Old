import React, {useEffect, useRef, useState} from "react";
import { Animated, View, StyleSheet, Dimensions } from "react-native";
import AppIntroSlider from 'react-native-app-intro-slider';

const Tutorial = ({renderItem, slides, onDone }) => {
    return (
        <Animated.View style={[styles.container, {height: Dimensions.get("screen").height}]}>
            <AppIntroSlider renderItem={renderItem} data={slides} onDone={onDone}/>
        </Animated.View>
    );
}

export default Tutorial

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0080FF',
        width: "100%",
        position: "absolute",
        zIndex: 1000
    }
});