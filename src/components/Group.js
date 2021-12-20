import React, { useEffect } from "react";
import { Pressable, View, Text, StyleSheet, ScrollView, Animated, Dimensions, Easing, Image } from "react-native";
import { useState, useRef } from "react";


import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'

import MemberList from "./MemberList";

import { useFonts } from 'expo-font';
import CameraPanel from "./CameraPanel";


const Group = ({show, user, group, onExit}) => {

    const [showCamera, setShowCamera] = useState(false);

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const [showMemberList, setShowMemberList] = useState(false);

    const [loaded] = useFonts({
        PoppinsBlack: require('./fonts/Poppins-Black.ttf'),
        PoppinsLight: require('./fonts/Poppins-Light.ttf')
    });

    const slideAnim = useRef(new Animated.Value(windowWidth)).current;
    const fadeOutAnim = useRef(new Animated.Value(0)).current;

    show ? Animated.timing(
        slideAnim,
        {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.bezier(0,1.08,.99,1),
        }
      ).start() 
    : Animated.timing(
        slideAnim,
        {
          toValue: windowWidth,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.bezier(0,1.08,.99,1),
        }
      ).start();
    
    useEffect(() => {
        if (user.username == group.admin) {
            setUserIsAdmin(true);
        }
    },[]);


    const [userIsAdmin, setUserIsAdmin] = useState(false);

    const chopTitle = (title, n) => {
        if (title.length > n) {
            return title.substring(0,n) + "...";
        }
        else {
            return title;
        }
    }

    const chopMembers = (members) => {
        let result = "";
        members.forEach((member) => {
            result = result + member + ", "
        });
        return chopTitle(result, 35);
    }

    const hideMemberList = () => {
        setShowMemberList(false);
        console.log("test")
    }

    return (
        <Animated.View style={[{transform: [{translateX: slideAnim}]},styles.container]}>

            <View style={{height: 40}}></View>

            <MemberList show={showMemberList} members={group.members} onHide={hideMemberList}/>

            <View style={{flexDirection: "row", width: "100%", zIndex: 1, backgroundColor: "#1E1E1E"}}>
                <Pressable onPress={onExit} style={({pressed}) => [{backgroundColor: pressed ? "#242424" : "#1E1E1E", paddingLeft: 10, paddingRight: 10, zIndex: 1},styles.button_back]}><Ionicons name="chevron-back" style={styles.icon}/></Pressable>
                <Pressable onPress={() => setShowMemberList(true)} style={({pressed}) => [{backgroundColor: pressed ? "#242424" : "#1E1E1E"},styles.header]}>
                    <Text style={styles.heading}>{chopTitle(group.title, 20)}</Text>
                    <Text style={styles.members}>{chopMembers(group.members)}</Text>
                </Pressable>
                {group.admin == user.username ? <>
                    <AntDesign style={styles.icon} name="adduser"/>
                    <MaterialCommunityIcons style={styles.icon} name="delete"/></>
                    : null}
                
            </View>
            <ScrollView style={styles.content}>

            </ScrollView>

            <CameraPanel show={showCamera} onExit={() => setShowCamera(false)}/>

            <View style={{position: "absolute", zIndex: 0, height: "100%", width: "100%", backgroundColor: "#171717", justifyContent: "center"}}>
                <Image source={require('./img/logo_glow.png')} style={styles.background_img}/>
            </View>
            <Pressable onPress={() => setShowCamera(true)} style={({pressed}) => [{backgroundColor: pressed ? "#0072e3" : "#0080FF"},styles.add_button]}>
                <MaterialIcons style={styles.camera} name="camera" />
            </Pressable>

        </Animated.View>
    );
}

export default Group

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 10
    },
    header: {
        flex: 4, 
        paddingTop: 10, 
        paddingBottom: 10,
        zIndex: 1
    },
    heading: {
        color: "white",
        fontFamily: "PoppinsBlack",
        fontSize: 20,
        marginLeft: 10
    },
    members: {
        color: "white",
        fontFamily: "PoppinsLight",
        fontSize: 13,
        marginLeft: 10
    },
    icon: {
        color: "white",
        fontSize: 25,
        textAlignVertical: "center",
        flex: 1,
        textAlign: "center",
        zIndex: 1
    },
    content: {
        flex: 1,
        zIndex: 1
    },
    add_button: {
        borderRadius: 100,
        width: 70,
        height: 70,
        justifyContent: "center",
        alignSelf: "flex-end",
        zIndex: 2,
        position: "absolute",
        bottom: 20,
        right: 20
    },
    camera: {
        color: "white",
        fontSize: 40,
        textAlign: "center"
    },
    background_img: {
        height: 150,
        width: 150,
        alignSelf: "center"
    },
    camera_container: {
        height: "70%",
        width: "100%",
        zIndex: 20,
        top: 110,
        position: "absolute"
    }
});