import React from "react";
import { View, Text } from 'react-native';
import { parse } from "react-native-svg";


const Statusbar = ({ status }) => {
    return (
        <View style={{
            width: "55%",
            height: 15,
            backgroundColor: "rgba(255,255,255,0.3)",
            alignSelf: "center",
            bottom: 0,
            borderRadius: 100,
            overflow: "hidden"
        }}>
            <View style={{
            width: status,
            height: 15,
            backgroundColor: "rgba(255,255,255,1)",
        }}>
            <Text style={{color: "#4f4f4f", fontFamily: "PoppinsBlack", alignSelf: "flex-end", right: 5, bottom: 1, fontSize: 13}}>{ parseInt(status) > 20 && parseInt(status) < 100 ? status.substring(0,2) + "%" : null }</Text>
        </View>
        </View>
    )
}

export default Statusbar