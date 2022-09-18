//React
import React from "react";
import { View, Text, StyleSheet, Image } from 'react-native'
import { responsiveFontSize, responsiveHeight } from "react-native-responsive-dimensions";

//Custom Components
import Button from "./Button";


const TutorialDialog = ({onSubmit, onCancel }) => {
    return <>
    <View style={styles.container}>

        <Image source={require('../../data/img/tutorial.png')} style={styles.tutorial_image}/>

        <Text style={styles.question}>Möchtest du ein Tutorial ansehen?</Text>
        <View style={{height: responsiveHeight(10)}}></View>

        <Button title={"Ja, jetzt ansehen"} color={"#0080FF"} color2={"white"} fontColor={"white"} hovercolor={"rgba(255,255,255,0.3)"} onPress={() => onSubmit()}/>
        <Button title={"Später"} color={"#484F78"} fontColor={"white"} hovercolor={"rgba(255,255,255,0.15)"} onPress={() => onCancel()}/>
        <View style={{height: responsiveHeight(10)}}></View>
    </View>
    </>
}

export default TutorialDialog

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
    }
});