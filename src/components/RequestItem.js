import React, {useEffect, useRef, useState} from "react";
import { Animated, View, StyleSheet, Text, Easing } from "react-native";
import ProfileImage from "./ProfileImage";

import { TouchableNativeFeedback } from "react-native";

//Firebase
import { setDoc, doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db, firestore } from "./FirebaseConfig";

import Feather from 'react-native-vector-icons/Feather'

const RequestItem = ({userid, onPress}) => {

    const opacityAnim = useRef(new Animated.Value(0)).current;
    const slide1Anim = useRef(new Animated.Value(-500)).current;
    const slide2Anim = useRef(new Animated.Value(-500)).current;

    useEffect(() => {
        loadUser();
    },[]);

    const animate = () => {
        Animated.timing(opacityAnim,{
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
            /* easing: Easing.bezier(0,1.02,.21,.97), */
        }).start();

        Animated.timing(slide1Anim,{
            toValue: 0,
            duration: 550,
            useNativeDriver: true,
            easing: Easing.bezier(0,1.02,.21,.97),
        }).start();

        Animated.timing(slide2Anim,{
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
            easing: Easing.bezier(0,1.02,.21,.97),
        }).start();
    }

    const [user, setUser] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const loadUser = async () => {
        try { 
            const docRef = doc(firestore, "users", userid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setUser({
                    username: docSnap.data().username,
                    photoUrl: docSnap.data().photoUrl
                });
            }
        }
        catch(e){
            console.log("Error:",e);
        }
        setIsLoading(false);
        animate();
    }


    return (<>
        { !isLoading ?  
        <Animated.View style={[{opacity: opacityAnim},styles.container]}>
                <View style={{flexDirection: "row",  alignItems: "center"}}>
                            <View style={{width: 20}}></View>
                            <Animated.View style={{transform: [{translateX: slide1Anim}], zIndex: 2}}>
                                <ProfileImage x={45} type={1} url={user.photoUrl}/>
                            </Animated.View>
                            <View style={{width: 20}}></View>
                            <Animated.View style={{flexDirection: "column", transform: [{translateX: slide2Anim}], zIndex: 1}}>
                                <Text style={styles.username}>{user.username}</Text>
                                <Text style={[styles.username,{fontFamily: "PoppinsLight", fontSize: 12, marginTop: -3}]}>{user.username}</Text>
                            </Animated.View>

                        <View style={{flex: 1}}>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("rgba(255,255,255,0.05)", false)} onPress={onPress}>
                                <View style={styles.touchable}>
                                    <Feather name="close" style={styles.icon}/>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                        <View style={{flex: 1}}>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("rgba(255,255,255,0.05)", false)} onPress={onPress}>
                                <View style={styles.touchable}>
                                    <Feather name="check" style={styles.icon}/>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                </View>
        </Animated.View>
        :   null
            }</>
    );
}

export default RequestItem

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: 80,
    },
    username: {
        color: "rgba(255,255,255,0.8)",
        fontFamily: "PoppinsBlack",
        fontSize: 15
    },
    touchable: {
        width: "100%",
        justifyContent: "center"
    }
});