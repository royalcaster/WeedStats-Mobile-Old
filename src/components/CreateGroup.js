import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { Animated, View, Text, Pressable, StyleSheet, TextInput, Easing, Dimensions, TouchableNativeFeedback } from "react-native";
import { useFonts } from 'expo-font';

import FontAwesome from "react-native-vector-icons/FontAwesome";

const CreateGroup = ({ user, onCreate, onexit }) => {

    const [loaded] = useFonts({
        PoppinsBlack: require('./fonts/Poppins-Black.ttf'),
        PoppinsLight: require('./fonts/Poppins-Light.ttf')
    });

    const windowHeight = Dimensions.get('window').height;
    const slideAnim = useRef(new Animated.Value(windowHeight)).current;

    const [rippleColor, setRippleColor] = useState("rgba(255,255,255,0.15)");
    const [rippleOverflow, setRippleOverflow] = useState(false);

    useEffect(() => {
        Animated.timing(
            slideAnim, {
                toValue: 0,
                duration: 350,
                useNativeDriver: true,
                easing: Easing.bezier(0,1.02,.21,.97),
            }
        ).start();
    },[]);

    const [groupData, setGroupData] = useState({
        title: "",
        admin: user.username,
        id: "",
        members: [{index: 0, name: user.username, latestonline: 0}],
        createdon: "",
        messages: []
    });

    return (
    <Animated.View style={[styles.container,{transform: [{translateY: slideAnim}]}]}>

        <View style={{height: 50}}></View>

        <View style={{alignItems: "center", flexDirection: "row"}}>                 
                <FontAwesome name="plus" style={{fontSize: 25, color: "white", marginLeft: 20}}/>
                <Text style={styles.heading}>Gruppe erstellen</Text>
        </View>

        <View style={{height: 50}}></View>
        
        <View style={{width: "80%", alignSelf: "center"}}>
            <Text style={styles.label}>Name der Gruppe: <Text style={{color: "#0080FF"}}>{groupData.title}</Text></Text>
            <TextInput style={styles.input} value={groupData.title} onChangeText={text => setGroupData({...groupData, title: text})} spellCheck={false}></TextInput>
        </View>

        <View style={{height: 50}}></View>

        <View style={{flexDirection: "row", width: "90%", alignSelf: "center", height: 50}}>

        <View style={{borderRadius: 100, overflow: "hidden", flex: 1,}}>
            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(rippleColor, false)} onPress={onexit}>
                <View style={styles.touchable}>
                    <Text style={styles.text}>Abbrechen</Text>
                </View>
            </TouchableNativeFeedback>
        </View>

        <View style={{width: 15}}></View> 

        <View style={{borderRadius: 100, overflow: "hidden", flex: 1,}}>
            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(rippleColor, false)} onPress={() => {
                if (groupData.title.length > 0) {
                    onCreate(groupData); onexit()
                }
                else {
                    alert("Bitte Namen der Gruppe angeben!");
                }
                }}>
                <View style={[styles.touchable,{backgroundColor: "#0080FF"}]}>
                <Text style={styles.text}>Erstellen</Text>
                </View>
            </TouchableNativeFeedback>
        </View>

        </View>
    </Animated.View>);
}

export default CreateGroup

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%"
    },
    heading: {
        fontFamily: "PoppinsBlack",
        color: "white",
        fontSize: 20,
        marginLeft: 10
    },
    label: {
        fontFamily: "PoppinsMedium",
        color: "rgba(255,255,255,0.75)",
        textAlign: "center",
        fontSize: 14,
    },
    input: {
        height: 60,
        width: "100%",
        backgroundColor: "#171717",
        marginTop: 5,
        borderRadius: 30,
        fontSize: 25,
        paddingLeft: 20,
        color: "#8a8a8a",
        fontFamily: "PoppinsBlack"
    },
    button: {
        flex: 1,
        padding: 10,
        borderRadius: 25,
    },
    text: {
        textAlign: "center",
        fontSize: 16,
        fontFamily: "PoppinsBlack",
        textAlignVertical: "center",
        color: "white"
    },
    touchable: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor: "rgba(255,255,255,0.25)",
        flex: 1,
    }
});