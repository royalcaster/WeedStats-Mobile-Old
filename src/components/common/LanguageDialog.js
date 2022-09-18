//React
import React from "react";
import { View, Text, StyleSheet, Image } from 'react-native'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import { TouchableNativeFeedback } from "react-native";

//Custom Components
import Button from "./Button";


const LanguageDialog = ({ onSelect}) => {
    return <>
    <View style={styles.container}>

        <TouchableNativeFeedback onPress={() => onSelect("de")} background={TouchableNativeFeedback.Ripple("rgba(255,255,255,0.15)", false)}>
            <View style={styles.touchable}>
                <Image resizeMode="center" style={styles.flagg} source={require('../../data/img/de.png')}/>
                <View style={{height: responsiveHeight(1)}}></View>
                <Text style={styles.label}>Deutsch (DE)</Text>
            </View>
        </TouchableNativeFeedback>

        <View style={{height: responsiveHeight(5)}}></View>

        <TouchableNativeFeedback onPress={() => onSelect("en")} background={TouchableNativeFeedback.Ripple("rgba(255,255,255,0.15)", false)}>
            <View style={styles.touchable}>
                <Image resizeMode="center" style={styles.flagg} source={require('../../data/img/gb.png')}/>
                <View style={{height: responsiveHeight(1)}}></View>
                <Text style={styles.label}>English (UK)</Text>
            </View>
        </TouchableNativeFeedback>

    </View>
    </>
}

export default LanguageDialog

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    question: {
        color: "white",
        fontFamily: "PoppinsBlack",
        fontSize: responsiveFontSize(3),
        alignSelf: "center",
        textAlign: "center",
        width: "80%"
    },
    tutorial_image: {
        height: 200,
        width: 200
    },
    label: {
        color: "white",
        fontFamily: "PoppinsMedium",
        fontSize: responsiveFontSize(2),
        alignSelf: "center"
    },
    touchable: {
        padding: 20
    },
    flagg: {
        height: 100,
        width: responsiveWidth(50)
    }
});