import React from "react";
import { useFonts } from "expo-font";
import { StyleSheet, Image, View, Text, Pressable, ScrollView, Dimensions} from 'react-native';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart,
  } from "react-native-chart-kit";

import FontAwesome from 'react-native-vector-icons/FontAwesome';

const StatsGraphs = () => {

    const [loaded] = useFonts({
        PoppinsBlack: require("./fonts/Poppins-Black.ttf"),
        PoppinsLight: require("./fonts/Poppins-Light.ttf"),
      });

    return (
    <ScrollView style={styles.container}>
        <View style={{alignItems: "center"}}>
            <FontAwesome name="bar-chart" style={{fontSize: 60, color: "white", marginBottom: 5}}/><Text style={styles.heading}>Grafiken</Text>
        </View>

        <View style={{height: 20}}></View>
        
        <View style={{alignItems: "center", flex: 1}}>
            
            

        </View>
    </ScrollView>
    )
}

export default StatsGraphs

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