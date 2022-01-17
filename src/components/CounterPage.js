import React, {useState, useRef, useEffect} from "react";
import {View, Pressable, Text, Image, Animated, Easing, StyleSheet} from 'react-native'
import Statusbar from "./Statusbar";
import { useFonts } from 'expo-font';

const CounterPage = ( { type, counter, toggleCounter, level_status, level, level_index, bg_color } ) => {

    const [loaded] = useFonts({
        PoppinsBlack: require('./fonts/Poppins-Black.ttf'),
        PoppinsThin: require('./fonts/Poppins-Thin.ttf')
    });

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const [buttonPressed, setButtonPressed] = useState(false);

    const buttonFill = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(
          fadeAnim,
          {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }
        ).start();
      }, [fadeAnim])

    buttonPressed ? 
    Animated.timing(
        buttonFill,
        {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        }
    ).start()
    : 
    Animated.timing(
        buttonFill,
        {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
        }
    ).start()




    return (
        <Animated.View style={[{backgroundColor: "#171717", opacity: fadeAnim},styles.container]}>

            <View style={{flex: 0.5, justifyContent: "center"}}></View>

            <View style={{flex: 3, justifyContent: "center", borderColor: "#0080FF"}}>

            <Text style={styles.counter_text}>{counter}</Text>

            </View>

            <View style={{backgroundColor: bg_color, borderTopLeftRadius: 15, borderTopRightRadius: 15, width: "80%", alignSelf: "center", flex: 2, marginTop: 30}}>

            {level_index == 1 ? <Image source={require('./img/lvl1.png')} style={styles.lvl_image}/> : null}
            {level_index == 2 ? <Image source={require('./img/lvl2.png')} style={styles.lvl_image}/> : null}
            {level_index == 3 ? <Image source={require('./img/lvl3.png')} style={styles.lvl_image}/> : null}
            {level_index == 4 ? <Image source={require('./img/lvl4.png')} style={styles.lvl_image}/> : null}
            {level_index == 5 ? <Image source={require('./img/lvl5.png')} style={styles.lvl_image}/> : null}
            {level_index == 6 ? <Image source={require('./img/lvl6.png')} style={styles.lvl_image}/> : null}
            {level_index == 7 ? <Image source={require('./img/lvl7.png')} style={styles.lvl_image}/> : null}


            <View style={{position: "absolute", bottom: 15, width: "100%"}}>
                <Text style={styles.level_text}>{level}</Text>
            </View>

            <Statusbar status={level_status} />
            </View>
            
            <Pressable style={styles.lighter_button} onPressIn={() => setButtonPressed(true)} onPressOut={() => setButtonPressed(false)} onLongPress={() => {toggleCounter(type.toLowerCase()); setButtonPressed(false);}}>

            <Animated.View style={{transform: [{scaleY: buttonFill}] ,height: 400, width: "100%", backgroundColor: "#0080FF", zIndex: 9, borderRadius: 0, top: 0, position: "absolute"}}>
            </Animated.View>

            {type == "Joint" ? <Image style={{height: 110, width: 35, alignSelf: "center", position: "absolute", zIndex: 10}} source={require('./img/joint.png')} /> : null}
            {type == "Bong" ? <Image style={{height: 120, width: 70, alignSelf: "center", position: "absolute", zIndex: 10}} source={require('./img/bong.png')} /> : null}
            {type == "Vape" ? <Image style={{height: 120, width: 70, alignSelf: "center", position: "absolute", zIndex: 10}} source={require('./img/vape.png')} /> : null}

            

            </Pressable>
            
        </Animated.View>
    )
}

export default CounterPage

const styles = StyleSheet.create({
    container: {
         flex: 1,
         flexDirection: "column"
    },
    type_text: {
        color: "white",
        fontFamily: "PoppinsBlack",
        alignSelf: "center",
        fontSize: 18
    },
    counter_text: {
        fontSize: 140,
        fontFamily: "PoppinsThin",
        alignSelf: "center",
        color: "white",
    },
    lvl_image: {
        height: 120, 
        width: 120,
        top: -40,
        alignSelf: "center",
        position: "absolute",
        zIndex: 20
    },
    level_text: {
        color: "white",
        fontFamily: "PoppinsBlack",
        fontSize: 27,
        textAlign: "center"
    },
    lighter_button: {
        backgroundColor: "#1E1E1E",
        width: "80%",
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        alignSelf: "center",
        height: 200,
        justifyContent: "center",
        flex: 3,
        marginBottom: 30,
        overflow: "hidden"
    },
    lighter: {
        height: 350,
        width: 350,
        alignSelf: "center",
        marginTop: 30,
        marginBottom: 30
    }
});