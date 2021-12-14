import React from "react";
import { View, Pressable, Text, ScrollView, Image, StyleSheet } from 'react-native'
import { useFonts } from "expo-font";

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Friends = ({user, handleLogOut}) => {

    const [loaded] = useFonts({
        PoppinsBlack: require("./fonts/Poppins-Black.ttf"),
        PoppinsLight: require("./fonts/Poppins-Light.ttf"),
      });

    return (
        <View style={styles.container}>

            <View style={{height: 50}}></View>

            <View style={{alignItems: "center", flexDirection: "row"}}>
                <FontAwesome5 name="user-friends" style={{fontSize: 25, color: "#c4c4c4", marginLeft: 20}}/><Text style={styles.heading}>Freunde</Text>
            </View>

            <View style={{height: 20}}></View>
            
            <View>
                <Text style={{color: "white"}}>(friendlist)</Text>
            </View>

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

export default Friends

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