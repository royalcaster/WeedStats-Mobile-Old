import React from "react";
import { useRef } from 'react'
import { View, Image, StyleSheet, Text, Pressable, Animated, Easing, Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Entypo from 'react-native-vector-icons/Entypo';

import Button from "./Button";

const Account = ({ user, handleLogOut, onexit, onShowDonation, onShowFeedback }) => {

    const window_height = Dimensions.get("window").height;

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(
            opacityAnim,
            {
              toValue: 1,
              duration: 400,
              easing: Easing.bezier(0,1.08,.99,1),
              useNativeDriver: true,
            }
          ).start();
      }, [opacityAnim])

    const [loaded] = useFonts({
        PoppinsBlack: require('./fonts/Poppins-Black.ttf'),
        PoppinsLight: require('./fonts/Poppins-Light.ttf')
    });

    const hide = () => {
        Animated.timing(
            opacityAnim,
            {
              toValue: 0,
              duration: 300,
              easing: Easing.bezier(0,1.08,.99,1),
              useNativeDriver: true,
            }
          ).start(({finished}) => {
            if (finished) {
                onexit();
            }
        });
    }

    return (
        <>
        <Animated.View style={[{opacity: opacityAnim, height: window_height + 20},styles.container]}>
            <View style={{height: 50}}></View>

            <Pressable onPress={() => hide()} style={({pressed}) => [{backgroundColor: pressed ? "#242424" : "#1E1E1E+"}, styles.pressable_back]}>
                <MaterialIcons name="arrow-back" style={styles.icon_back}/>
            </Pressable>

            <View style={{
                alignItems: "center",
                flex: 1
            }}>
                <Image style={styles.profile_img} source={{uri: user.photoUrl}}></Image>

                <Text style={styles.username}>{user.username}</Text>
                <Text style={styles.email}>{user.email}</Text>

                <View style={{flexDirection: "row"}}>
                    <Text style={styles.member_text}>Mitglied seit:</Text><View style={{width: 20}}/>
                    <Text style={[styles.member_text,{fontFamily: "PoppinsBlack"}]}>{user.member_since}</Text>
                </View>
            </View>

            <Button onPress={onShowFeedback} title={" Feedback senden"} icon={<Entypo name="newsletter" style={styles.money_icon} />} borderradius={100} color={"#4a4a4a"} fontColor={"white"}/> 
            
            <View style={{height: 15}}></View>

            <Button onPress={onShowDonation} title={"WeedStats unterstützen"} icon={<MaterialIcons name="euro" style={styles.money_icon} />} borderradius={100} color={"#4a4a4a"} fontColor={"white"}/> 
            
            <View style={{height: 15}}></View>

            <Button onPress={handleLogOut} title={"Abmelden"} icon={<MaterialIcons name="logout" style={styles.money_icon} />} borderradius={100} color={"#eb4034"} fontColor={"white"}/> 

            <View style={{height: 15}}></View>

        </Animated.View>
        </>
    );
}

export default Account

const styles = StyleSheet.create({
    container: {
        width: "100%",
        zIndex: 21,
        backgroundColor: "#171717"
    },
    profile_img: {
        height: 120,
        width: 120
    },
    username: {
        color: "white",
        fontSize: 25,
        fontFamily: "PoppinsBlack",
        marginTop: 20
    },
    email: {
        color: "#797a7a",
        fontSize: 16,
        fontFamily: "PoppinsLight",
        marginTop: 0
    },
    signOutButton: {
        width: "80%",
        alignSelf: "center",
        height: 50,
        borderRadius: 100,
        justifyContent: "center",
        marginTop: 20,
        bottom: 20,
        flexDirection: "row"
    },
    money_icon: {
        fontSize: 25,
        color: "white",
        textAlignVertical: "center"
    },
    pressable_back: {
        width: 80, 
        padding: 10, 
        borderRadius: 25, 
        marginLeft: 10
    },
    icon_back: {
        color: "white", 
        fontSize: 30, 
        left: 5
    },
    member_text: {
        color: "#797a7a",
        fontSize: 18,
        fontFamily: "PoppinsLight",
        marginTop: 20,
    },
    button_text: {
        color: "white",
        fontSize: 18,
        fontFamily: "PoppinsLight",
        textAlign: "center",
        top: 2,
        textAlignVertical: "center"
    }
});