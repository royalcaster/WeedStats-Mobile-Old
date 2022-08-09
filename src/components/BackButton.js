import React, {useEffect, useRef, useState} from "react";
import { Animated, View, StyleSheet } from "react-native";

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import { TouchableNativeFeedback } from "react-native";

const BackButton = ({onPress}) => {
    return (
        <Animated.View style={styles.container}>
            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("rgba(255,255,255,0.2)", true)} onPress={onPress}>
                <View style={styles.touchable}>
                    <MaterialIcons name="arrow-back" style={styles.icon_back}/>
                </View>
            </TouchableNativeFeedback>
        </Animated.View>
    );
}

export default BackButton

const styles = StyleSheet.create({
    container: {
        
    },   
    icon_back: {
        color: "rgba(255,255,255,0.75)", 
        fontSize: 25, 
        padding: 15
    },
    touchable: {
        width: 60,
        height: 60,
        backgroundColor: "rgba(0,0,0,0.0)",
        borderRadius: 25
    }
    
});