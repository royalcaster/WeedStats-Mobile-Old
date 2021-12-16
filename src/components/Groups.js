import React from "react";
import { View, Pressable, Text, ScrollView, Image, StyleSheet } from 'react-native'
import { useFonts } from "expo-font";

import { setDoc, doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { ref, push } from "firebase/database";
import { db, firestore } from "./FirebaseConfig";

import { useState, useEffect } from "react";

import OptionPanel from "./OptionPanel";

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';

const Groups = ({user, handleLogOut}) => {

    useEffect(() => {
        setLoading(true);
        getGroupList();
        
    },[])

    const [loading, setLoading] = useState();

    const groupList = [];
    var groupIDs;

    const getGroupList = async () => {
        try {
        //Referenz zu Nutzerdokument, durch Google-Username identifiziert
        const docRef = doc(firestore, "users", user.username);
        //Snapshot von diesem Dokument zum Lesen
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            groupIDs = docSnap.data().groups;
        }
        }
        catch(e) {
            console.log("Error:",e)
        }

        //Aus Liste der IDs die Date der echten Gruppen laden
        try {
            groupIDs.forEach( async (group) => {
                const docRef = doc(firestore, "groups", group);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    groupList.push({
                        admin: docSnap.data().admin,
                        craetedon: docSnap.data().craetedon,
                        id: docSnap.data().id,
                        members: docSnap.data().members,
                        title: docSnap.data().title,
                    });
                console.log(docSnap.data().admin)
                }
            });
        }
        catch(e) {
            console.log("Error:",e)
        }
        
    }

    const [showMenu, setShowMenu] = useState(false);

    const hideMenu = () => {
        setShowMenu(false);
    }

    const [loaded] = useFonts({
        PoppinsBlack: require("./fonts/Poppins-Black.ttf"),
        PoppinsLight: require("./fonts/Poppins-Light.ttf"),
      });

    return (
        <View style={styles.container}>

            <View style={{height: 50}}></View>

            <View style={{alignItems: "center", flexDirection: "row"}}>                 
                <FontAwesome5 name="user-friends" style={{fontSize: 25, color: "#c4c4c4", marginLeft: 20}}/>
                <Text style={styles.heading}>Gruppen</Text>
                <Pressable onPress={() => {setShowMenu(true)}} style={({pressed}) => [{backgroundColor: pressed ? "#2b2b2b" : "#1E1E1E"},{position: "absolute", right: 15, padding: 15, borderRadius: 20}]}>
                    <Entypo  style={{color: "#c4c4c4", fontSize: 25}} name="dots-three-horizontal"/>
                </Pressable>
            </View>

            {groupList.map((group) => {
                <Text>{group.admin}</Text>
            })}

            <View style={{height: 20}}></View>
            
            {showMenu ? <OptionPanel onexit={hideMenu}/> : null}

            <Pressable style={({pressed}) => [{backgroundColor: pressed ? "#333333" : "#2b2b2b"},styles.account_button]}>
                <View style={{ flexDirection: "row"}}>
                    <View style={{flex: 1}}>
                        <Image source={{uri: user.photoUrl}} style={{height: "100%", width: "100%"}}></Image>
                    </View>
                    <View style={{flex: 4, justifyContent: "center"}}>
                        <Text style={{left: 15, fontFamily: "PoppinsBlack", color: "#c4c4c4", fontSize: 18}}>{user.username}</Text>
                        <Text style={{left: 15, fontFamily: "PoppinsLight", color: "#999999"}}>Bong-Main</Text>
                    </View>
                </View>
            </Pressable>
          
        </View>
    );
}

export default Groups

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1E1E1E",
        height: "100%",
        width: "100%"
    },
    heading: {
        fontFamily: "PoppinsBlack",
        color: "#c4c4c4",
        fontSize: 20,
        marginLeft: 10
    },
    account_button: {
        width: "100%",
        height: 80,
        position: "absolute",
        bottom: 10,
    }
});