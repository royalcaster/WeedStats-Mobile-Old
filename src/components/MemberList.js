import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { Pressable, View, Text, StyleSheet, Animated, Easing, ScrollView, Dimensions } from "react-native";
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { useFonts } from 'expo-font';
import uuid from 'react-native-uuid'

const MemberList = ({ members, show, onHide }) => {

    const windowHeight = Dimensions.get('window').height;

    const fadeDown = useRef(new Animated.Value(-windowHeight)).current;

    const [loaded] = useFonts({
        PoppinsBlack: require('./fonts/Poppins-Black.ttf'),
        PoppinsLight: require('./fonts/Poppins-Light.ttf')
    });

    show  ? 
        Animated.timing(
            fadeDown,
            {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
              easing: Easing.bezier(0,1.02,.21,.97),
            }
          ).start()
    : 
    Animated.timing(
        fadeDown,
        {
          toValue: -windowHeight - 80,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.bezier(0,1.02,.21,.97),
        }
      ).start();

    return (
        <Animated.View style={[{transform: [{translateY: fadeDown}]},styles.container]}>

            <View style={{height: 100}}></View>
            
            <ScrollView style={styles.scrollview}>
                {members.map((member) => {
                    return  <View key={uuid.v4()} style={styles.member_container}>
                                <Text style={styles.member_text}>{member.name}</Text>
                            </View>
                })}
                
            
            </ScrollView>

            <Pressable onPress={onHide} style={styles.close_button}>
                <EvilIcons name="close" style={styles.close} />
            </Pressable>
            

        </Animated.View>
    );
}

export default MemberList

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.75)",
        position: "absolute",
        zIndex: 10,
        width: "100%",
        height: "100%"
    },
    scrollview: {
        width: "100%",
        alignSelf: "center",
        backgroundColor: "#1E1E1E",
        borderRadius: 25
    },
    close_button: {
        height: 100,
        justifyContent: "center",
        bottom: 50,
        position: "relative",
        bottom: 0
    },
    close: {
        fontSize: 60,
        color: "white",
        textAlign: "center",
    },
    member_container: {
        paddingLeft: 20,
        paddingBottom: 20,
        paddingTop: 20,
    },
    member_text: {
        color: "white",
        fontFamily: "PoppinsLight"
    }
});