import React from "react";
import { useEffect, useRef } from "react";
import { View, Image, StyleSheet, Text, Animated, Pressable, Easing } from 'react-native';
import { useFonts } from 'expo-font';

import Feather from 'react-native-vector-icons/Feather';
import Button from "./Button";

const Levels = ({onexit}) => {

    const fadeAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(
          fadeAnim,
          {
            toValue: 1,
            duration: 200,
            easing: Easing.bezier(0,1.02,.21,.97),
            useNativeDriver: true,
          }
        ).start();
      }, [fadeAnim])

    const hide = () => {
        Animated.timing(
            fadeAnim,
            {
              toValue: 0,
              duration: 200,
              easing: Easing.bezier(0,1.02,.21,.97),
              useNativeDriver: true,
            }
          ).start(({finished}) => {
            if (finished) {
                onexit();
            }
        });
    }  

    const [loaded] = useFonts({
        PoppinsBlack: require('./fonts/Poppins-Black.ttf'),
        PoppinsLight: require('./fonts/Poppins-Light.ttf')
    });

    return (
        <Animated.View style={[{opacity: fadeAnim},styles.container]}>

        <View style={{height: 60}}></View>

            <View style={{
                alignSelf: "center",
                borderRadius: 10,
                width: "90%",
                backgroundColor: "#3BA426",
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
                maxWidth: 700,
            }}>
                <Image style={styles.lvl_img} source={require('./img/lvl1.png')}></Image>
                <View style={{marginLeft: 15}}>
                    <Text style={styles.lvl_name}>Nappo</Text>
                    <Text style={styles.lvl_bounds}>0-69</Text>
                </View>
            </View>
            
            <View style={{
                alignSelf: "center",
                borderRadius: 10,
                width: "90%",
                backgroundColor: "#81440A",
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
                maxWidth: 700,
            }}>
                <Image style={styles.lvl_img} source={require('./img/lvl2.png')}></Image>
                <View style={{marginLeft: 15}}>
                    <Text style={styles.lvl_name}>Beginner</Text>
                    <Text style={styles.lvl_bounds}>70-139</Text>
                </View>
            </View>

            <View style={{
                alignSelf: "center",
                borderRadius: 10,
                width: "90%",
                backgroundColor: "#c85a14",
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
                maxWidth: 700,
            }}>
                <Image style={styles.lvl_img} source={require('./img/lvl3.png')}></Image>
                <View style={{marginLeft: 15}}>
                    <Text style={styles.lvl_name}>Amateur</Text>
                    <Text style={styles.lvl_bounds}>140-209</Text>
                </View>
            </View>

            <View style={{
                alignSelf: "center",
                borderRadius: 10,
                width: "90%",
                backgroundColor: "#0781E1",
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
                maxWidth: 700,
            }}>
                <Image style={styles.lvl_img} source={require('./img/lvl4.png')}></Image>
                <View style={{marginLeft: 15}}>
                    <Text style={styles.lvl_name}>Fortgeschrittener</Text>
                    <Text style={styles.lvl_bounds}>210-279</Text>
                </View>
            </View>

            <View style={{
                alignSelf: "center",
                borderRadius: 10,
                width: "90%",
                backgroundColor: "#4A26A4",
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
                maxWidth: 700,
            }}>
                <Image style={styles.lvl_img} source={require('./img/lvl5.png')}></Image>
                <View style={{marginLeft: 15}}>
                    <Text style={styles.lvl_name}>Smurf</Text>
                    <Text style={styles.lvl_bounds}>280-349</Text>
                </View>
            </View>

            <View style={{
                alignSelf: "center",
                borderRadius: 10,
                width: "90%",
                backgroundColor: "#C407E1",
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
                maxWidth: 700,
            }}>
                <Image style={styles.lvl_img} source={require('./img/lvl6.png')}></Image>
                <View style={{marginLeft: 15}}>
                    <Text style={styles.lvl_name}>Experte</Text>
                    <Text style={styles.lvl_bounds}>350-419</Text>
                </View>
            </View>

            <View style={{
                alignSelf: "center",
                borderRadius: 10,
                width: "90%",
                backgroundColor: "#D90F0F",
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
                borderColor: "#E6C743",
                borderWidth: 3,
                maxWidth: 700,
            }}>
                <Image style={styles.lvl_img} source={require('./img/lvl7.png')}></Image>
                <View style={{marginLeft: 15}}>
                    <Text style={styles.lvl_name}>Legende</Text>
                    <Text style={styles.lvl_bounds}>ab 420</Text>
                </View>
            </View>

            <Button title={"Zurück"} icon={<Feather name="arrow-left" style={styles.cancel_icon}/>} color={"#eb4034"} fontColor={"white"} onPress={() => hide()} borderradius={100}/>

        </Animated.View>
    );
}

export default Levels

const styles = StyleSheet.create({
    container: {
        marginTop: 0,
        width: "100%",
        height: "95%",
        justifyContent: "center"
    },
    lvl_img: {
        height: 80,
        width: 80,
        marginLeft: 25,
        marginTop: -10

    },
    lvl_name: {
        fontSize: 24,
        fontFamily: "PoppinsBlack",
        color: "white"
    },
    lvl_bounds: {
        fontFamily: "PoppinsLight",
        fontSize:18,
        marginTop: -5,
        color: "white"
    },
    
    cancelButton: { 
        width: "80%",
        alignSelf: "center",
        height: 50,
        borderRadius: 100,
        justifyContent: "center",
        marginTop: 20,
        bottom: 20,
        flexDirection: "row"
    },
    cancel_icon: {
        fontSize: 25,
        color: "white",
        textAlignVertical: "center",
        position: "relative",
        marginTop: 20
    }
});