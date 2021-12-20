import React from "react";
import { useState } from "react";
import { Animated, View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import { useFonts } from 'expo-font';

import FontAwesome from "react-native-vector-icons/FontAwesome";

const CreateGroup = ({ user, onCreate, onexit }) => {

    const [loaded] = useFonts({
        PoppinsBlack: require('./fonts/Poppins-Black.ttf'),
        PoppinsLight: require('./fonts/Poppins-Light.ttf')
    });

    const [groupData, setGroupData] = useState({
        title: "",
        admin: user.username,
        id: "",
        members: [],
        createdon: ""
    });

    return (
    <Animated.View style={styles.container}>

        <View style={{height: 50}}></View>

        <View style={{alignItems: "center", flexDirection: "row"}}>                 
                <FontAwesome name="plus" style={{fontSize: 25, color: "#c4c4c4", marginLeft: 20}}/>
                <Text style={styles.heading}>Gruppe erstellen</Text>
        </View>

        <View style={{height: 50}}></View>
        
        <View style={{width: "80%", alignSelf: "center"}}>
            <Text style={styles.label}>Name der Gruppe</Text>
            <TextInput style={styles.input} value={groupData.title} onChangeText={text => setGroupData({...groupData, title: text})} spellCheck={false}></TextInput>
        </View>

        <View style={{height: 50}}></View>

        <View style={{flexDirection: "row", width: "90%", alignSelf: "center"}}>
            <Pressable onPress={onexit} style={({pressed}) => [{backgroundColor: pressed ? "#404040" : "#4a4a4a"},styles.button]} /* onPress={onExit} */><Text style={styles.text}>Abbrechen</Text></Pressable>
            <View style={{width: 10}}></View>
            <Pressable onPress={() => {
                if (groupData.title.length > 0) {
                    onCreate(groupData); onexit()
                }
                else {
                    alert("Bitte Namen der Gruppe angeben!");
                }
                }} style={({pressed}) => [{backgroundColor: pressed ? "#0072e3" : "#0080FF"},styles.button]} /* onPress={onCreate} */><Text style={styles.text}>Erstellen</Text></Pressable>
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
        color: "#c4c4c4",
        fontSize: 20,
        marginLeft: 10
    },
    label: {
        fontFamily: "PoppinsLight",
        color: "#8a8a8a",
        fontSize: 16,
        marginLeft: 25
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
        color: "#d1d1d1"
    }
});