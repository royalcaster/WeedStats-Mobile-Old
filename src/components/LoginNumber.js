import React, {useEffect, useRef, useState} from "react";
import { Animated, View, StyleSheet, Text } from "react-native";

const LoginNumber = ({ fontFamily, color, top, left, fontSize, number }) => {
    return (<>
        {/* <Animated.View style={[styles.container,{top: top, left: left }]}> */}
            <Text style={{fontSize: fontSize, fontFamily: fontFamily, color: color, top: top, left: left}}>{number}</Text>
       {/*  </Animated.View> */}</>
    );
}

export default LoginNumber

const styles = StyleSheet.create({
    container: {

    }
});