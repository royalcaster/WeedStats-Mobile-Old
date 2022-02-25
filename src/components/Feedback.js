import React, { useState } from 'react';
import { useRef, useEffect } from 'react';
import { StyleSheet, Image, View, Text, Pressable, Animated, Easing, Dimensions, TextInput, Modal, ActivityIndicator} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import moment from "moment";

import { useFonts } from 'expo-font';

import Button from './Button';

import RNTextArea from "@freakycoder/react-native-text-area";

import uuid from 'react-native-uuid'

import {
    setDoc,
    doc,
    getDoc,
    updateDoc,
    Timestamp,
    addDoc,
    limitToLast,
    query,
  } from "firebase/firestore";

  import { db, firestore } from "./FirebaseConfig";

const Feedback = ( { onexit, user } ) => {

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const window_height = Dimensions.get("window").height;

    const [feedback, setFeedback] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [locked, setLocked] = useState(false);

    useEffect(() => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.bezier(0,1.02,.21,.97),
          useNativeDriver: true,
        }).start();
        Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 200,
            easing: Easing.bezier(0,1.02,.21,.97),
            useNativeDriver: true,
          }).start();
      }, [fadeAnim, opacityAnim]);

    const [loaded] = useFonts({
        PoppinsBlack: require('./fonts/Poppins-Black.ttf'),
        PoppinsLight: require('./fonts/Poppins-Light.ttf')
    });

    const hide = () => {
        Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(({finished}) => {
            if (finished) {
                onexit();
            }
        });
    }

    const sendFeedback = async () => {
        setLoading(true);

        try{
            const docRef = doc(firestore, "users", user.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const now = moment(new Date(Date.now()));
                const last = moment(new Date(1645359692 * 1000));
                
                if (now.diff(last, "days")<31) {
                    setLocked(true);
                    setLoading(false);
                }
                else {
                    await setDoc(doc(firestore, "feedback", uuid.v4()),{
                        email: email,
                        feedback: feedback
                    }).then();
                    setSent(true);
                    setLoading(false);
                }
            }
        }
        catch(e){
            console.log("Error:",e);
        }
    }


    return (
        <Animated.View style={[{transform: [{scale: fadeAnim}], opacity: opacityAnim, height: window_height + 20},styles.container]}>

            
            <Modal 
                animationType="fade"
                transparent={true}
                visible={sent}>
                <View style={{alignItems: "center", justifyContent: "center", backgroundColor:"rgba(0,0,0,0.5)", flex: 1}}>

                    <View style={{width: "90%", height: 300, backgroundColor: "#171717", alignSelf: "center", borderRadius: 25}}>
                        <View style={{flex: 1}}>
                            <Text style={[styles.heading,{marginLeft: 0, textAlign: "center", height: "100%", textAlignVertical: "center", fontSize: 22}]}>Feedback gesendet</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={[styles.text,{fontSize: 15}]}>Danke, dass du uns hilfst, WeedStats besser zu machen.</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Button title={"Kein Problem!"} color={"#0080FF"} borderradius={25} fontColor={"white"} onPress={hide}/>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal 
                animationType="fade"
                transparent={true}
                visible={locked}>
                <View style={{alignItems: "center", justifyContent: "center", backgroundColor:"rgba(0,0,0,0.5)", flex: 1}}>

                    <View style={{width: "90%", height: 300, backgroundColor: "#171717", alignSelf: "center", borderRadius: 25}}>
                        <View style={{flex: 1}}>
                            <Text style={[styles.heading,{marginLeft: 0, textAlign: "center", height: "100%", textAlignVertical: "center", fontSize: 22}]}>Achtung</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={[styles.text,{fontSize: 15}]}>Du hast in den letzten 30 Tagen bereist ein Feedback gesendet. Bald darfst du wieder!</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Button title={"Verstanden!"} color={"#0080FF"} borderradius={25} fontColor={"white"} onPress={hide}/>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={{height: 50}} />

            {loading ? <View style={{flex: 1, alignItems: "center"}}><View style={{height: 200}}></View><ActivityIndicator size={"large"} color={"#0080FF"}/></View> : <>
            <View style={{flexDirection: "row", alignContent: "center", alignItems: "center"}}>
                    <Pressable onPress={onexit} style={({pressed}) => [{backgroundColor: pressed ? "#242424" : "#1E1E1E+"}, styles.pressable_back]}>
                        <MaterialIcons name="arrow-back" style={styles.icon_back}/>
                        
                    </Pressable>
                <Text style={styles.heading}>Feedback senden</Text>
            </View>

            <View style={{height: 20}}></View>

            <View style={{flex: 1.5}}>

                <Text style={{color: "rgba(255,255,255,0.75)", fontFamily: "PoppinsLight", width: "90%", alignSelf: "center", fontSize: 15}}>
                Erzähl uns, wie du WeedStats findest. 
                Optional kannst du deine Email-Adresse für eine Antwort angeben, 
                ansonsten bleibt dein Feedback selbstverständlich anonym.</Text>

                <View style={{height: 20}}></View>

                <View style={{flex: 1}}>
                    <TextInput style={styles.input} placeholder={"Email-Adresse (optional)"} placeholderTextColor={"rgba(255,255,255,0.5)"} value={email} onChangeText={(text) => setEmail(text)}/>
                </View>

                <View style={{height: 10}}></View>

                <View style={{flex: 4}}>

                <RNTextArea
                    maxCharLimit={300}
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    exceedCharCountColor="#990606"
                    placeholder={"Dein Feedback..."}
                    onChangeText={(text) => setFeedback(text)}
                    value={feedback}
                    style={{backgroundColor: "#171717", borderRadius: 25, width: "90%", alignSelf: "center", height: "100%"}}
                    textInputStyle={{fontFamily: "PoppinsLight", color: "white", fontSize: 17}}
                    spellCheck={false}
        
                />

                </View>

            </View>
            
            <View style={{flex: 1}}>

            <View style={{height: 40}}></View>

            <View style={{flex: 1}}>

            <View style={{flexDirection: "row"}}>
                <View style={{flex: 1}}>
                    <Button title={"Abbrechen"} color={"rgba(255,255,255,0.25)"} borderradius={25} fontColor={"white"} onPress={hide}/>
                </View>

                <View style={{flex: 1}}>
                    <Button title={"Senden"} color={"#0080FF"} borderradius={25} fontColor={"white"} onPress={() => {setLoading(true); sendFeedback()}}/>
                </View>
            </View>

            <View style={{height: 20}}></View>

            <Text style={{color: "#eb4034", fontFamily: "PoppinsLight", width: "90%", alignSelf: "center", fontSize: 15, textAlign: "center"}}>
            Beachte, dass du auf 1 Feedback alle 30 Tage bschränkt bist. </Text>

            </View>

            </View>
            </>}

            
            

        </Animated.View>
    )
}

export default Feedback

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "#1E1E1E",
        flexDirection: "column",
        flex: 1,
        position: "absolute",
        zIndex: 21
    },
    text: {
        alignSelf: "center",
        fontFamily: "PoppinsLight",
        fontSize: 18,
        color: "white",
        maxWidth: 200,
        textAlign: "center"
    },
    bold: {
        fontFamily: "PoppinsBlack"
    },
    image: {
        height: 150,
        width: 200,
        alignSelf: "center"
    },
    close: {
        color: "#696969",
        fontSize:40,
        position: "relative",
    },
    close_text: {
        marginLeft: 20,
        borderRadius: 15,
        position: "absolute",
        bottom: 20
    },
    cancelButton: { 
        width: "80%",
        alignSelf: "center",
        height: 50,
        borderRadius: 100,
        justifyContent: "center",
        flexDirection: "row",
        position: "absolute",
        bottom: 20
    },
    cancel_icon: {
        fontSize: 25,
        color: "white",
        textAlignVertical: "center",
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
    heading: {
      color: "white",
      fontSize: 20,
      fontFamily: "PoppinsBlack",
      marginLeft: 20,
      textAlign: "left"
    },
    input: {
        backgroundColor: "#171717",
        width: "90%",
        alignSelf: "center",
        borderRadius: 25,
        height: "100%",
        fontFamily: "PoppinsLight",
        paddingLeft: 20,
        color: "white",
        fontSize: 17
    }
});