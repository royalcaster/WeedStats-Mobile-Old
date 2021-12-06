import React from "react";
import { useFonts } from 'expo-font';
import Statusbar from "./Statusbar";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LevelImage from "./LevelImage";
import { ImageBackgroundComponent, StyleSheet, Text, TouchableWithoutFeedbackBase, View, Image, Pressable } from 'react-native';

const JointCounter = ({ counter, level, level_status, level_index, bg_color }) => {

    const [loaded] = useFonts({
        PoppinsBlack: require('./fonts/Poppins-Black.ttf'),
        PoppinsLight: require('./fonts/Poppins-Light.ttf')
      });
    
      if (!loaded) {
        return null;
      }

      if (counter == 420) {
      }

    return (
        <View id="joint_container" style={{
            width: "80%",
            alignSelf: "center",
            backgroundColor: bg_color,
            alignItems: "center",
            borderRadius: 30,
            marginTop: 20,
            marginBottom: 20,
            maxWidth: 700,
        }}> 
            <Image style={styles.joint_image} source={require('./img/joint.png')}/>
            <LevelImage index={level_index}/>
            <Text style={styles.counter_number}>{counter}</Text>
            <Statusbar status={level_status}/>
            <Text style={styles.level_label}>{level}</Text>
            <Pressable style={styles.add_pressable}>
                <FontAwesome name='fire' style={styles.fire_icon}/>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    counter_number: {
        color: "white",
        fontSize: 60,
        fontFamily: "PoppinsBlack",
        marginBottom: -20,
        marginTop: -25
    },
    level_label: {
        color: "white",
        fontFamily: "PoppinsLight",
        fontSize: 20,
        marginBottom: 3
    },
    joint_image: {
        width: 60,
        height: 180,
        position: "absolute",
        alignSelf: "flex-start",
        marginLeft: -15,
        marginTop: -5
    },
    add_pressable: {
        backgroundColor: "#383838",
        padding: 20,
        position: "absolute",
        alignSelf: "flex-end",
        borderRadius: 20,
        marginTop: 50,
        right: -10
    },
    fire_icon: {
        color: "white",
        fontSize: 30
    }
});

export default JointCounter