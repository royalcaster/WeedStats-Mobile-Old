import React, {useEffect, useRef, useState} from "react";
import { Animated, View, StyleSheet, TextInput, Dimensions, Easing, Text, ScrollView, ActivityIndicator, TouchableNativeFeedback, Modal, Pressable, TouchableNativeFeedbackBase } from "react-native";

import BackButton from './BackButton'

import uuid from 'react-native-uuid'

//Firebase
import { setDoc, doc, getDoc, updateDoc, getDocs, Timestamp, collection, query, where } from "firebase/firestore";
import { db, firestore } from "./FirebaseConfig";

import FriendListItem from "./FriendListItem";

import Antdesign from 'react-native-vector-icons/AntDesign'

const FriendRequests = ({user, onExit}) => {

    const screen_height = Dimensions.get("screen").height;
    const slideAnim = useRef(new Animated.Value(screen_height)).current;

    const [requests, setRequests] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Animated.timing(slideAnim,{
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.bezier(0,1.02,.21,.97)
        }).start();
        loadRequests();
    });
    
    const hide = () => {
        Animated.timing(slideAnim,{
            toValue: screen_height,
            duration: 600,
            useNativeDriver: true,
            easing: Easing.bezier(0,1.02,.21,.97)
        }).start(({finished}) => {
            if (finished) {
                onExit();
            }
        });
    }

    const makeFriendRequest = async (id) => {

        const docRef = doc(firestore, "users", id);
        const docSnap = await getDoc(docRef);

        var requested;
        if (docSnap.exists()) {
                requested = {
                id: docSnap.data().id,
                requests: docSnap.data().requests
            }
        }

        if (requested.requests.includes(user.id)) {
            console.log("Anfrage bereits gesendet!");
            setAlreadySent(true);
        }
        else {
            try{
                const docRef = doc(firestore, "users", requested.id);
                const docSnap = await getDoc(docRef);
                
                
                if (docSnap.exists()) {
                    var buffer = docSnap.data().requests;
                    updateDoc(docRef,{
                        requests: buffer.concat(user.id)
                    });
                }
            }
            catch(e){
                console.log("Error:", e)
            }
        }
        setModalVisible(false);
    }

    loadRequests = async () => {
        const docRef = doc(firestore, "users", user.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setRequests(docSnap.data().requests);
        }
        setLoading(false);
    }

    return (
        <Animated.View style={[styles.container,{transform: [{translateY: slideAnim}]}]}>
            <View style={{height: 50}}></View>

            <View style={{width: "100%", flexDirection: "row", maxHeight: 60, flex: 1}} >
                <View style={{flex: 1, alignItems: "center"}}>
                    <BackButton onPress={() => hide()}/>
                </View>
                <View style={{flex: 4, justifyContent: "center", alignItems: "flex-start"}}>
                    <Text style={styles.heading}>Anfragen</Text>
                </View>
            </View>
            
            <ScrollView style={{width: "100%", flex: 1, alignSelf: "center", marginTop: 20}}>

            {!requests ? null : <>
            {loading ? <ActivityIndicator color={"#0080FF"} size={"large"} style={{marginTop: 50}}/> : (
                results.map((result) => {
                    return <FriendListItem key={uuid.v4()} userid={result.id} onPress={() => {setActiveRequested(result);setModalVisible(true)}}/>
                })
            )}
            </>}

            </ScrollView>

            
        </Animated.View>
    );
}

export default FriendRequests

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
        backgroundColor: "#171717",
        zIndex: 10,
        position: "absolute",
    },
    input: {
        backgroundColor: "rgba(0,0,0,0.3)",
        marginRight: 15,
        marginLeft: 0,
        height: "100%",
        borderRadius: 100,
        paddingLeft: 20,
        color: "white",
        fontSize: 18,
        fontFamily: "PoppinsMedium",
    },
    modal_container: {
        backgroundColor: "#1E1E1E",
        width: "90%",
        height: 300,
        alignSelf: "center",
        borderRadius: 25,
        flexDirection: "column"
    },
    heading: {
        color: "white",
        textAlign: "center",
        fontFamily: "PoppinsBlack",
        fontSize: 22,
        maxWidth: 300,
        marginLeft: 10
    },
    touchable: {
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    icon: {
        fontSize: 40
    },
    info_icon: {
        color: "white",
        fontSize: 30,
        textAlign: "center",
        marginTop: 20
    }
});