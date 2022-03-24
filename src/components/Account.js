import React, { useState, useEffect } from "react";
import { useRef } from 'react'
import { View, Image, StyleSheet, Text, Pressable, Animated, Easing, Dimensions, TouchableNativeFeedback, Modal, BackHandler } from 'react-native';

import { useFonts } from 'expo-font';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Antdesign from 'react-native-vector-icons/AntDesign'

import ProfileImage from "./ProfileImage";

import BackButton from "./BackButton";

import Entypo from 'react-native-vector-icons/Entypo';

//Firebase
import { setDoc, doc, getDoc, updateDoc, getDocs, Timestamp, collection, query, where, deleteDoc } from "firebase/firestore";
import { db, firestore } from "./FirebaseConfig";

import Button from "./Button";

const Account = ({ user, handleLogOut, onexit, onShowDonation, onShowFeedback, onShowLevels }) => {

    const window_height = Dimensions.get("window").height;

    const [showLevels, setShowLevels] = useState(false);
    const hideLevels = () => {
    setShowLevels(false);
    }

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

    // Call back function when back button is pressed
    const backActionHandler = () => {
        hide();
        return true;
    };

    useEffect(() => {

        // Add event listener for hardware back button press on Android
        BackHandler.addEventListener("hardwareBackPress", backActionHandler);
    
        return () =>
          // clear/remove event listener
          BackHandler.removeEventListener("hardwareBackPress", backActionHandler);
      }, []);


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

    const deleteAccount = async () => {
        handleLogOut();
        const docRef = doc(firestore, "users", user.id);
        await deleteDoc(docRef);
    }   

    const [showDelete, setShowDelete] = useState(false);

    return (
        <>
        <Animated.View style={[{opacity: opacityAnim, height: "100%"},styles.container]}>

            <Modal 
                animationType="fade"
                transparent={true}
                visible={showDelete}>
                <View style={{alignItems: "center", justifyContent: "center", backgroundColor:"rgba(0,0,0,0.5)", flex: 1}}>

                    <View style={{width: "90%", height: 300, backgroundColor: "#171717", alignSelf: "center", borderRadius: 25}}>
                        <View style={{flex: 1}}>
                            <Text style={[styles.heading,{marginLeft: 0, textAlign: "center", height: "100%", textAlignVertical: "center", fontSize: 22}]}>Achtung</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={[styles.text,{fontSize: 15}]}>Das kann nicht rückgängig gemacht werden. Dieses Konto wirklich löschen?</Text>
                        </View>
                        <View style={{flex: 1, flexDirection: "row"}}>
                        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("rgba(255,255,255,0.05)", true)} onPress={() => setShowDelete(false)}>
                                <View style={styles.touchable}>
                                    <Antdesign name="close" style={[styles.icon,{color: "#eb4034"}]}/>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("rgba(255,255,255,0.05)", true)} onPress={() => deleteAccount()}>
                                <View style={styles.touchable}>
                                    <Antdesign name="check" style={[styles.icon,{color: "#3BA426"}]}/>
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>
                    </View>
                </View>
            </Modal>


            <View style={{height: 50}}></View>

            <View style={{marginLeft: 20}}>
                <BackButton onPress={() => hide()}/>
            </View>

            <View style={{
                alignItems: "center",
                flex: 1
            }}>
                <ProfileImage url={user.photoUrl} x={120} type={1}/>

                <Text style={styles.username}>{user.username}</Text>
                <Text style={styles.email}>{user.email}</Text>

                <View style={{flexDirection: "row"}}>
                    <Text style={styles.member_text}>Mitglied seit:</Text><View style={{width: 20}}/>
                    <Text style={[styles.member_text,{fontFamily: "PoppinsLight"}]}>{user.member_since}</Text>
                </View>
            </View>

            <Button fontColor={"white"} onPress={onShowLevels} borderradius={100} color={"#4a4a4a"} title={" Levelübersicht"} icon={<FontAwesome name="trophy" style={styles.money_icon} />}/>

            <View style={{height: 15}}></View>

            <Button onPress={onShowFeedback} title={" Feedback senden"} icon={<Entypo name="newsletter" style={styles.money_icon} />} borderradius={100} color={"#4a4a4a"} fontColor={"white"}/> 
            
            <View style={{height: 15}}></View>

            <Button onPress={onShowDonation} title={"WeedStats unterstützen"} icon={<MaterialIcons name="euro" style={styles.money_icon} />} borderradius={100} color={"#4a4a4a"} fontColor={"white"}/> 
            
            <View style={{height: 15}}></View>

            <Button onPress={handleLogOut} title={"Abmelden"} icon={<MaterialIcons name="logout" style={styles.money_icon} />} borderradius={100} color={"#eb4034"} fontColor={"white"}/> 

            <View style={{height: 10}}></View>

            <View style={{width: "100%"}}>
                <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("rgba(255,255,255,0.05)", false)} onPress={() => setShowDelete(true)}>
                    <View style={styles.touchable_delete}>
                        <Text style={styles.delete_text}>Dieses Konto löschen</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>

            <View style={{height: 10}}></View>

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
        marginTop: -5
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
        fontSize: 15,
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
    },
    touchable_delete: {
        width: "100%",
        alignSelf: "center",
        height: 60,
        borderRadius: 100
    },
    delete_text: {
        color: "#eb4034",
        fontFamily: "PoppinsLight",
        alignSelf: "center",
        textAlignVertical: "center",
        height: "100%"
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
        alignSelf: "center"
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
    },
    text: {
        color: "white",
        fontFamily: "PoppinsLight",
        textAlign: "center",
        maxWidth: 300,
        alignSelf: "center"
    }
});