import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const Statusbar = ({ status }) => {

    const chopStatus = () => {
        if (Number.isNaN(status)) {
            return null;
        }
       else if (status < 10) {
        return status.toString().substring(0,3) + "%"
       }
       else if (status == 100) {
        return "100%"
       }
       else if (status == "0%") {
        return "0%"
       }
       else {
        return status.toString().substring(0,2) + "%"
       }
    }

    return (
        <View style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255,255,255,0.3)",
            alignSelf: "center",
            bottom: 0,
            borderRadius: 10,
            overflow: "hidden",
            alignItems: "center"
        }}>
            <Text style={styles.status}>{chopStatus(status)}</Text>
            
            <View style={{width: chopStatus(status), alignSelf: "flex-start",  height: "100%", backgroundColor: "rgba(255,255,255,1)"}}>
            </View>
        </View>
    )
}

export default Statusbar

const styles = StyleSheet.create({
    status: {
        color: "white", 
        fontFamily: "PoppinsMedium",
        fontSize: 12,
        position: "absolute",
        zIndex: 1,
        textAlignVertical: "center",
        top: -1,
        opacity: 0.75,
        top: "30%"
    }
})