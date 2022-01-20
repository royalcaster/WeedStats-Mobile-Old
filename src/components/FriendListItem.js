import React, {useEffect, useRef, useState} from "react";
import { Animated, View, StyleSheet } from "react-native";
import ProfileImage from "./ProfileImage";

const FriendListItem = () => {
    return (
        <Animated.View style={styles.container}>
            <ProfileImage x={40} type={1} url={user.photoUrl}/>
        </Animated.View>
    );
}

export default FriendListItem

const styles = StyleSheet.create({
    container: {
        flexDirection: "row"
    }  
});