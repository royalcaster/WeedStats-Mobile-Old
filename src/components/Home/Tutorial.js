//React
import React from "react";
import { Animated, StyleSheet, Dimensions } from "react-native";

//Third Party
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
        backgroundColor: "#1E2132",
        width: "100%",
        position: "absolute",
        zIndex: 1000
    }
});