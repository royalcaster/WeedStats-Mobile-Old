import React from "react";
import  { useEffect, useRef } from 'react'
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native'

import FontAwesome from "react-native-vector-icons/FontAwesome";

const OptionPanel = ({onShowCreate, onexit}) => {

    const slideAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(
            slideAnim,
            {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }
          ).start();
    }, [slideAnim])

    return (
    <Animated.View style={[{opacity: slideAnim},styles.container]}>
        <Pressable onPress={() => {onShowCreate(); onexit();}} style={({pressed}) => [{backgroundColor: pressed ? "#333333" : "#2b2b2b"},styles.pressable]}>
            <FontAwesome name="plus" style={styles.icon}/>
            <Text style={styles.text}>Gruppe erstellen</Text>
        </Pressable>

        <Pressable onPress={() => {onexit();}} style={({pressed}) => [{backgroundColor: pressed ? "#333333" : "#2b2b2b"},styles.pressable]}>
            <FontAwesome name="share" style={styles.icon}/>
            <Text style={styles.text}>Gruppe beitreten</Text>
        </Pressable>

        <Pressable onPress={() => {onexit();}} style={({pressed}) => [{backgroundColor: pressed ? "#333333" : "#2b2b2b"},styles.pressable]}>
            <FontAwesome name="group" style={styles.icon}/>
            <Text style={styles.text}>Freundesliste</Text>
        </Pressable>

        <Pressable onPress={() => {onexit();}} onPress={onexit} style={({pressed}) => [{backgroundColor: pressed ? "#333333" : "#2b2b2b", justifyContent: "center"},styles.pressable]}>
            <FontAwesome name="times" style={[styles.icon,{marginLeft: 0}]}/>
        </Pressable>
    </Animated.View>)
}

export default OptionPanel

const styles = StyleSheet.create({
    container: {
        zIndex: 10,
        position: "absolute",
        right: 0,
        top: 50,
        backgroundColor: "#1E1E1E",
        width: 220
    },
    pressable: {
        flexDirection: "row",
        height: 60,
        textAlignVertical: "center",
        marginBottom: 1
    },
    icon: {
        textAlignVertical: "center",
        marginLeft: 20,
        color: "#c4c4c4",
        fontSize: 18
    },
    text: {
        textAlignVertical: "center",
        marginLeft: 10,
        color: "#c4c4c4",
        fontFamily: "PoppinsLight",
        fontSize: 16
    }
});