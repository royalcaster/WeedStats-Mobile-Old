import React, {useEffect, useRef, useState} from "react";
import { Animated, View, StyleSheet } from "react-native";

import ProfileImage from "./ProfileImage";

const SearchPanelItem = () => {
    return (
        <Animated.View style={styles.container}>
            <ProfileImage type={1} x={50}  />
        </Animated.View>
    );
}

export default SearchPanelItem

const styles = StyleSheet.create({
    
    container: {

    }
});