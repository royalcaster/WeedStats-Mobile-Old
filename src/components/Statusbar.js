import React from "react";
import { View } from 'react-native';


const Statusbar = ({ status }) => {
    return (
        <View style={{
            width: "60%",
            height: 5,
            backgroundColor: "rgba(255,255,255,0.3)",
            marginBottom: 2,
            marginTop: 5
        }}>
            <View style={{
            width: status,
            height: 5,
            backgroundColor: "rgba(255,255,255,1)"
        }}></View>
        </View>
    )
}

export default Statusbar