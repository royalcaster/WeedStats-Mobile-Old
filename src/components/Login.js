import React from "react";
import { ImageBackgroundBase, StyleSheet, Text, TouchableWithoutFeedbackBase, View, Button, Pressable, Image } from 'react-native';
import { useFonts } from 'expo-font';
import { signInWithGoogle } from "../Service";

const Login = ({ handleLogin }) => {

    const [loaded] = useFonts({
        PoppinsBlack: require('./fonts/Poppins-Black.ttf'),
        PoppinsLight: require('./fonts/Poppins-Light.ttf'),
      });
    
      if (!loaded) {
        return null;
      }

    return (
        <View style={styles.login_container}>

            <Image style={styles.login_logo} source={require('./img/logo.png')}/>

            <Text style={styles.login_heading}>WeedStats</Text>
            <Pressable style={styles.login_pressable}>
                <Text style={styles.login_pressable_text} onPress={handleLogin}>Mit Google anmelden</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    login_container: {
        justifyContent: "center",
        backgroundColor: "#1E1E1E",
        alignItems: "center",
        height: "100%"
    },
    login_heading: {
        color: "white",
        fontSize: 50,
        fontFamily: "PoppinsBlack",
        textAlign: "center",
        marginTop: 20
    },
    login_pressable: {
        backgroundColor: "#4287f5",
        borderColor: "#4287f5",
        borderWidth: 2,
        borderRadius: 5,
        width: 300,
        height: 50,
        justifyContent: "center",
        marginTop: 120
    },
    login_pressable_text: {
        color: "white",
        alignSelf: "center",
        fontFamily: "PoppinsLight",
        fontSize: 18,
        color: "white"
    },
    login_logo: {
        width: 150,
        height: 150
    }
});

export default Login