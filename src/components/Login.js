import React from "react";
import { ImageBackgroundBase, StyleSheet, Text, TouchableNativeFeedback, View, Pressable, Image, Animated } from 'react-native';
import { useFonts } from 'expo-font';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Button from "./Button";
import { useEffect, useRef } from 'react';
import Feather from 'react-native-vector-icons/Feather'

const Login = ({ handleLogin }) => {

    const icon = <FontAwesome name="google" style={{fontSize: 25, color: "white"}}/>

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(
            fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true
            }
        ).start();
    },[]);

    const [loaded] = useFonts({
        PoppinsBlack: require('./fonts/Poppins-Black.ttf'),
        PoppinsLight: require('./fonts/Poppins-Medium.ttf'),
      });
    
      if (!loaded) {
        return null;
      }

    return (
        <Animated.View style={[{opacity: fadeAnim},styles.login_container]}>

            <View style={{height: 50}}></View>

            <View style={{width: "100%"}}>
                <Image style={styles.login_logo} source={require('./img/logo_1E.png')}/>
                {/* <Text style={styles.login_heading}>WeedStats</Text> */}
            </View>

            <View style={{height: 20}}></View>

            <View style={styles.info_container}>
                <View style={{flex: 2, justifyContent: "center"}}>
                    <Feather name="info" style={styles.info_icon}/>
                </View> 
                
                <View style={{flex: 4}}> 
                    <Text style={[styles.text,{fontFamily: "PoppinsBlack", fontSize: 25}]}>Willkommen</Text>
                    <View style={{height:10}}></View>
                    <Text style={styles.text}>WeedStats verwendet die Authentifizierung von Google zur Erfassung der Nutzer.</Text>
                    <View style={{height:30}}></View>
                    <Text style={styles.text}>Du willst wissen, worauf du dich einlässt?</Text>
                    <View style={{height:30}}></View>
                    <Pressable style={{width: "100%", height: 50, justifyContent: "center"}}>
                        <Text style={[styles.text,{fontFamily: "PoppinsBlack", color: "#0080FF", fontSize: 18}]}>Lies unsere Datenschutzbestimmung</Text>
                    </Pressable>
                </View> 
            </View>

            
            <View style={{ width: "100%", flex: 1, alignItems: "center", justifyContent: "center"}}>
                <Button fontColor={"white"} icon={icon} title={"Mit Google Anmelden"} borderradius={100} color={"#1E1E1E"} onPress={handleLogin} hovercolor={"rgba(0,0,0,0.3)"}/>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    login_container: {
        backgroundColor: "#0080FF",
        height: "100%"
    },
    login_heading: {
        color: "#1E1E1E",
        fontSize: 25,
        fontFamily: "PoppinsBlack",
        textAlign: "center",
        textAlignVertical: "center",
        marginTop: 10
    },
    login_pressable: {
        borderWidth: 2,
        borderRadius: 100,
        width: 300,
        height: 60,
        justifyContent: "center",
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        overflow: "hidden"
    },
    login_pressable_text: {
        color: "white",
        alignSelf: "center",
        fontFamily: "PoppinsLight",
        fontSize: 18,
        color: "#1E1E1E"
    },
    login_logo: {
        width: 80,
        height: 80,
        alignSelf: "center"
    },
    info_container: {
        width: "85%",
        flex: 4,
        backgroundColor: "#1E1E1E",
        alignSelf: "center",
        borderRadius: 20
    },
    info_icon: {
        color: "white",
        alignSelf: "center",
        fontSize: 70,
    },
    text: {
        color: "white",
        fontFamily: "PoppinsLight",
        width: "85%",
        alignSelf: "center",
        textAlign: "center",
        fontSize: 15
    }
});

export default Login