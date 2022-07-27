import React, {useEffect, useRef, useState} from "react";
import { Animated, View, StyleSheet } from "react-native";
import { TouchableNativeFeedback } from "react-native";

const IconButton = ({icon, onPress}) => {
    return (
        <Animated.View style={styles.container}>
            <TouchableNativeFeedback
        onPress={() => {
          onPress();
        }}
        background={TouchableNativeFeedback.Ripple("rgba(255,255,255,0.2)", true)}
        style={{ height: "100%", width: "100%" }}
      >
        <View style={styles.touchable}>
            {icon}
        </View>
      </TouchableNativeFeedback>
        </Animated.View>
    );
}

export default IconButton

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1E2132",
        borderRadius: 100,
        height: 60,
        width: 60
    },
    touchable: {
        height: "100%",
        width: "100%",
        padding: 20,
        borderRadius: 100
    }
});