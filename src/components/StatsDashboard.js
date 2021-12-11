import React from "react";
import { useFonts } from "expo-font";
import { StyleSheet, Image, View, Text, Pressable, ScrollView} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const StatsDashboard = () => {

    const [loaded] = useFonts({
        PoppinsBlack: require("./fonts/Poppins-Black.ttf"),
        PoppinsLight: require("./fonts/Poppins-Light.ttf"),
      });

    return (
    <ScrollView style={styles.container}>
        <View style={{alignItems: "center"}}>
            <MaterialCommunityIcons name="monitor-dashboard" style={{fontSize: 60, color: "white", marginBottom: 5}}/><Text style={styles.heading}>Dashboard</Text>
        </View>
        
        <View style={{alignItems: "center", flex: 1}}>
            <Text>(Content)</Text>
        </View>

    </ScrollView>
    )
}

export default StatsDashboard

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1E1E1E",
        width: "100%"
    },
    heading: {
        fontFamily: "PoppinsBlack",
        color: "white",
        fontSize: 18,
    }
});