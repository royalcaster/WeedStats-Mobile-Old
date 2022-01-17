import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing, TouchableNativeFeedback, Image } from "react-native";

const MenuButton = ({type, url, icon, title, color, hovercolor, borderradius, onPress, selected}) => {

  const [rippleColor, setRippleColor] = useState(hovercolor);
  const [rippleOverflow, setRippleOverflow] = useState(true);
        
    return (
      <View style={[{backgroundColor: color, borderRadius: borderradius},styles.container]}>
      <TouchableNativeFeedback
        onPress={() => {
          onPress();
        }}
        background={TouchableNativeFeedback.Ripple("rgba(255,255,255,0.05)", rippleOverflow)}
        style={{height: "100%"}}
      >

        {
            type == "img" ? 
            <View style={styles.touchable}>
                <Image source={url} style={styles.image}/>
            </View>
            :   <View style={styles.touchable}>
                    {icon}
                <Text style={[{color: selected ? "white" : "#4a4a4a"},styles.title]}>{title}</Text>
        </View>
        }
            
      </TouchableNativeFeedback>
    </View>
    );
}

export default MenuButton

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flex: 1,
        padding: 0
    },
    title: {
        fontSize: 13,
        fontFamily: "PoppinsLight",
        zIndex: 6,
        marginTop: -10,
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
    },
    image: {
        height: 70,
        width: 70,
        alignSelf: "center",
        marginBottom: 5,
      },
});