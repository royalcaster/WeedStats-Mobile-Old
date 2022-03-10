import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing, TouchableNativeFeedback } from "react-native";

import Ripple from 'react-native-material-ripple';

const Button = ({icon, title, color, hovercolor, borderradius, onPress, fontColor}) => {

  const [rippleColor, setRippleColor] = useState(hovercolor);
  const [rippleOverflow, setRippleOverflow] = useState(true);
        
    return (
      <View style={[{backgroundColor: color, borderRadius: borderradius},styles.container]}>
      <TouchableNativeFeedback
        onPress={() => {
          onPress();
        }}
        background={TouchableNativeFeedback.Ripple(rippleColor, rippleOverflow)} 
        style={{height: "100%", width: "100%"}}
      >
        <View style={styles.touchable}>
          <Text> {icon}</Text>
          <Text style={[{color: fontColor},styles.title]}> {title}</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
    );
}

export default Button

const styles = StyleSheet.create({
    container: {
        height: 50,
        width: "80%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        alignSelf: "center"
    },
    title: {
        fontSize: 16,
        fontFamily: "PoppinsLight",
        zIndex: 6,
        marginTop: 3
    },
    touch: {
        width: "100%",
        height: 100,
        borderRadius: 100,
        backgroundColor: "green",
        position: "absolute",
        zIndex: 5
    },
    touchable: {
      height: "100%",
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row"
    }
});