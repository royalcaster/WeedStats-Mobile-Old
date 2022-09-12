//React
import React, { useContext, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableNativeFeedback } from 'react-native'
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import { LanguageContext } from "../../../../data/LanguageContext";
import Languages from '../../../../data/languages.json'

const LanguageSelector = ({ toggleLanguage, value }) => {

    const language = useContext(LanguageContext);

    const handleToggle = ( lang ) => {
        if (lang == "en" && JSON.stringify(language) === JSON.stringify(Languages.de)) {
            toggleLanguage("en");
        }
        else if (lang == "de" && JSON.stringify(language) === JSON.stringify(Languages.en)) {
            toggleLanguage("de");
        }
    }

    return <View style={styles.container}>

        <TouchableNativeFeedback 
            onPress={() => handleToggle("de")}
            background={TouchableNativeFeedback.Ripple("#484F78", false)}>
            <View style={[styles.touchable, {backgroundColor: value == "de" ? "#0080FF" : "#131520"}]}>
                <Image style={styles.language_image} source={require("../../../../data/img/de.png")}/>
            </View>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback 
            onPress={() => handleToggle("en")}
            background={TouchableNativeFeedback.Ripple("#484F78", false)}>
            <View style={[styles.touchable, {flexDirection: "row", backgroundColor: value == "en" ? "#0080FF" : "#131520"}]}>
                <View><Image style={styles.language_image} source={require("../../../../data/img/gb.png")}/></View>
                <View><Image style={styles.language_image} source={require("../../../../data/img/us.png")}/></View>
            </View>
        </TouchableNativeFeedback>

    </View>
}

export default LanguageSelector

const styles = StyleSheet.create({
    container: {
        width: "90%",
        borderRadius: 10,
        backgroundColor: "#131520",
        flexDirection: "row",
        alignSelf: "center",
        overflow: "hidden"
    },
    touchable: {
        flexDirection: "row",
    },
    language_image: {
        height: responsiveHeight(3.5),
        width: responsiveWidth(12),
        margin: 20,
        borderRadius: 3,
        alignSelf: "center"
    },
    touchable: {
        flex: 1
    }
});