import React from "react";
import { View, Image, StyleSheet, Text, Pressable } from 'react-native';
import { useFonts } from 'expo-font';

const Account = ({ user, handleLogOut }) => {

    const [loaded] = useFonts({
        PoppinsBlack: require('./fonts/Poppins-Black.ttf'),
        PoppinsLight: require('./fonts/Poppins-Light.ttf')
    });

    return (
        <View style={styles.container}>
            <View style={{height: 50}}></View>

            <View style={{
                alignItems: "center"
            }}>
                <Image style={styles.profile_img} source={{uri: user.photoUrl}}></Image>
                <Text style={styles.username}>{user.username}</Text>
                <Text style={styles.email}>{user.email}</Text>
            </View>
            
            <Pressable onPress={handleLogOut} style={{
                backgroundColor: "#eb4034",
                width: "80%",
                alignSelf: "center",
                height: 50,
                borderRadius: 5,
                justifyContent: "center",
                marginTop: 20
            }}><Text style={{
                color: "white",
                fontSize: 18,
                fontFamily: "PoppinsLight",
                alignSelf: "center"
            }}>Abmelden</Text></Pressable>

        </View>
    );
}

export default Account

const styles = StyleSheet.create({
    container: {

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
        marginTop: 0
    }
});