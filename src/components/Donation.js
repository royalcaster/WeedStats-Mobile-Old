import React from 'react';
import { StyleSheet, Image, View, Text, Pressable} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import { backgroundColor, color, transform } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
import { useFonts } from 'expo-font';

const Donation = ( { onexit } ) => {



    const [loaded] = useFonts({
        PoppinsBlack: require('./fonts/Poppins-Black.ttf'),
        PoppinsLight: require('./fonts/Poppins-Light.ttf')
    });

    return (
        <View style={styles.container}>
            <View style={{height: 50}} />
            <Pressable onPress={onexit} style={({pressed}) => [{backgroundColor: pressed ? "#292929" : "#1E1E1E"},styles.close_text]}>
                <Feather name="arrow-left" style={styles.close}/>
            </Pressable>
            
            

                <View style={{height: 50}} />
                <Text style={styles.text}>Du feierst <Text style={[styles.text, styles.bold]}>WeedStats</Text> und willst das Projekt weiterbringen?</Text>
                <View style={{height: 30}} />
                <Image source={require('./img/döner.png')} style={styles.image}></Image>
                <View style={{height: 20}} />
                <Text style={styles.text}>Gib uns einen Döner aus!</Text>
        </View>
    )
}

export default Donation

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: "#1E1E1E",

    },
    text: {
        alignSelf: "center",
        fontFamily: "PoppinsLight",
        fontSize: 18,
        color: "#696969",
        maxWidth: 300
    },
    bold: {
        fontFamily: "PoppinsBlack"
    },
    image: {
        height: 150,
        width: 150,
        alignSelf: "center"
    },
    close: {
        color: "#696969",
        fontSize:40,
        position: "relative",
    },
    close_text: {
        marginLeft: 20,
        borderRadius: 15
    }
});