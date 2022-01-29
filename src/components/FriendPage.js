import React, {useEffect, useRef, useState} from "react";
import { Animated, Easing, View, StyleSheet, Dimensions, Text, Image, ScrollView } from "react-native";

//Firebase
import { setDoc, doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db, firestore } from "./FirebaseConfig";

import BackButton from "./BackButton";

const FriendPage = ({ show, userid, onExit }) => {

    const screen_width = Dimensions.get("screen").width;

    const [user, setUser] = useState();

    const slideAnim = useRef(new Animated.Value(screen_width)).current;

    useEffect(() => {
        if (userid) {
            getUser();
        }
    },[userid]);

    const getUser = async () => {
        try {
            const docRef = doc(firestore, "users", userid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setUser({
                    username: docSnap.data().username,
                    photoUrl: chopUrl(docSnap.data().photoUrl),
                    member_since: docSnap.data().member_since,
                    main_counter: docSnap.data().main_counter,
                    last_act_timestamp: docSnap.data().last_entry_timestamp,
                    last_act_type: docSnap.data().last_entry_type
                });
            }
        }
        catch(e){
            console.log("Error", e);
        }
        
    }

    const slide = () => {
        Animated.timing(slideAnim,{
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
            easing: Easing.bezier(0,1.02,.21,.97),
        }).start();
    }

    const hide = () => {
        Animated.timing(slideAnim,{
            toValue: screen_width,
            duration: 400,
            useNativeDriver: true,
            easing: Easing.bezier(0,1.02,.21,.97),
        }).start(({finished}) => {
            if (finished) {
                onExit();
                setUser({...user, photoUrl: " "});
            }
        });
    }

    show ? slide() : hide();

    const chopUrl = (url) => {
        var result;
        result = url.replace("s96-c","s800-c");
        return result;
    }

    const chopTimeStamp = (timestamp) => {
        var a = new Date(timestamp);
        
        return  <View style={{justifyContent: "center"}}>
                    <Text style={styles.date}>{a.toDateString()}</Text>
                    <Text style={[styles.date]}>{a.toTimeString().substring(0,5) + " Uhr"}</Text>
                </View>
    }

    return (
        <>
            {user ? <Animated.View style={[styles.container,{transform: [{translateX: slideAnim}]}]}>

                        {/* <View style={{height: 50, zIndex: 6, position: "absolute"}}></View> */}

                         <View style={{zIndex: 6, paddingLeft: 15, marginTop: 50, position: "absolute"}}>
                            <BackButton onPress={() => onExit()}/>
                        </View>

                        <Image style={[styles.image,{height: screen_width}]} source={{uri: user.photoUrl}}/>

                        <ScrollView style={{zIndex: 5, position: "relative"}}>
                            <View style={{width: "100%", height: screen_width,}}></View>
                            <View style={{backgroundColor: "#171717", height: 800, position: "relative", bottom: 0}}>

                                <View style={{height: 20}}></View>

                                <Text style={styles.username}>{user.username}</Text>
                                <Text style={styles.member_since}>Mitglied seit: {user.member_since}</Text>

                                <View style={{height: 20}}></View>

                                <View style={{width: "100%", alignSelf: "center", backgroundColor: "#1E1E1E"}}>
                                    <View style={{height: 15}}></View>
                                    <Text style={styles.label}>Gesamt</Text>
                                    <Text style={styles.value}>{user.main_counter}</Text>
                                </View>

                                <View style={{width: "100%", alignSelf: "center"}}>
                                    <View style={{height: 15}}></View>
                                    <Text style={styles.label}>Letzte Aktivität</Text>
                                    {user.last_act_type == "joint" ? <Image style={styles.type_image_joint} source={require('./img/joint.png')}/> : null}
                                    {user.last_act_type == "bong" ? <Image style={styles.type_image_bong} source={require('./img/bong.png')}/> : null}
                                    {user.last_act_type == "vape" ? <Image style={styles.type_image_vape} source={require('./img/vape.png')}/> : null}
                                    <Text style={styles.date}>{chopTimeStamp(user.last_act_timestamp)}</Text>
                                </View>

                            </View>
                            
                        </ScrollView>


                    </Animated.View> : null}
        </> 
    );
}

export default FriendPage

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
        backgroundColor: "#171717",
        zIndex: 5,
        position: "absolute"
    },
    image: {
        width: "100%",
        position: "absolute",
        zIndex: 4
    },
    username: {
        color: "white",
        fontSize: 35, 
        fontFamily: "PoppinsBlack",
        marginLeft: 20
    },
    member_since: {
        color: "rgba(255,255,255,0.5)",
        fontFamily: "PoppinsLight",
        marginLeft: 20,
        marginTop: -10
    },
    label: {
        color: "rgba(255,255,255,0.75)",
        fontSize: 15,
        fontFamily: "PoppinsLight",
        textAlignVertical: "center",
        marginLeft: 20
    },
    value: {
        color: "#0080FF",
        fontSize: 50,
        fontFamily: "PoppinsBlack",
        textAlignVertical: "center",
        marginTop: -15,
        textAlign: "center"
    },
    date: {
        color: "white",
        fontSize: 16,
        fontFamily: "PoppinsBlack",
        textAlignVertical: "center",
        textAlign: "center"
    },
    type_image_joint: {
        width: 30,
        height: 80,
        marginTop: 5,
        marginBottom: 10,
        alignSelf: "center"
    },
    type_image_bong: {
        width: 40,
        height: 70,
        marginTop: 5,
        marginBottom: 10,
        alignSelf: "center"
    },
    type_image_vape: {
        width: 30,
        height: 90,
        marginTop: 5,
        marginBottom: 10,
        alignSelf: "center"
    }
});