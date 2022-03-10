import React from "react";
import { View, Image, StyleSheet } from 'react-native'

const ProfileImage = ({ x, url, type }) => {
    return (
        <>
        {type == 1 ? 
            <View style={{height: x, width: x, borderRadius: 100, overflow: "hidden"}}>
            <Image style={{height: "100%"}} source={{uri: url}}/>
        </View>
        : null}
        {type == 2 ? 
            <View style={{height: x, width: x, borderRadius: 0, overflow: "hidden"}}>
            <Image style={{height: "100%"}} source={{uri: url}}/>
        </View>
        : null}
        </>
    );
}

export default ProfileImage