import React from "react";
import { useEffect, useRef, useState } from "react";
import { useFonts } from "expo-font";
import Statusbar from "./Statusbar";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import LevelImage from "./LevelImage";
import {
  ImageBackgroundComponent,
  StyleSheet,
  Text,
  TouchableWithoutFeedbackBase,
  View,
  Image,
  Pressable,
  Animated,
} from "react-native";

import { LinearGradient } from 'expo-linear-gradient';


const CounterItem = ({
  type,
  counter,
  level,
  level_status,
  level_index,
  bg_colors,
  toggleCounter,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [buttonPressed, setButtonPressed] = useState(false);

  const buttonFill = useRef(new Animated.Value(0)).current;

  buttonPressed ? 
  Animated.timing(
      buttonFill,
      {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
      }
  ).start()
  : 
  Animated.timing(
      buttonFill,
      {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
      }
  ).start()

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const [loaded] = useFonts({
    PoppinsBlack: require("./fonts/Poppins-Black.ttf"),
    PoppinsLight: require("./fonts/Poppins-Light.ttf"),
  });

  if (!loaded) {
    return null;
  }

  if (counter == 420) {
  }

  return (
    <View>
    <LinearGradient colors={
      [bg_colors.c1, bg_colors.c2]} style={{
    width: "80%",
    alignSelf: "center",
    /* backgroundColor: bg_color, */
    alignItems: "center",
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 20,
    maxWidth: 700,
    /* opacity: fadeAnim, */
  }}>
    {/* <Animated.View
      id="joint_container"
      style={{
        width: "80%",
        alignSelf: "center",
        backgroundColor: bg_color,
        alignItems: "center",
        borderRadius: 30,
        marginTop: 20,
        marginBottom: 20,
        maxWidth: 700,
        opacity: fadeAnim,
      }}
    > */}
    
      {type === "joint" ? (
        <Image style={styles.joint_img} source={require("./img/joint.png")} />
      ) : null}
      {type === "bong" ? (
        <Image style={styles.bong_img} source={require("./img/bong.png")} />
      ) : null}
      {type === "vape" ? (
        <Image style={styles.vape_img} source={require("./img/vape.png")} />
      ) : null}
      <LevelImage index={level_index} />
      <Text style={styles.counter_number}>{counter}</Text>
      <Statusbar status={level_status}></Statusbar>
      <Text style={styles.level_label}>{level}</Text>
      <Pressable
        onPressIn={() => setButtonPressed(true)} onPressOut={() => setButtonPressed(false)} onLongPress={() => {toggleCounter(type.toLowerCase()); setButtonPressed(false);}}
        style={({ pressed }) => [
          { backgroundColor: pressed ? "#2b2b2b" : "#383838" },
          styles.add_pressable,
        ]}
      >
        <FontAwesome name="fire" style={styles.fire_icon} />
        <Animated.View style={{transform: [{scaleY: buttonFill}] ,height: 220, width: 200, backgroundColor: "#0080FF", zIndex: 9, borderRadius: 0, top: 0, left: 0, position: "absolute"}}>
            </Animated.View>
      </Pressable>
      
    {/* </Animated.View> */}
    </LinearGradient>
    </View>
  );
};

export default CounterItem;

const styles = StyleSheet.create({
  counter_number: {
    color: "white",
    fontSize: 60,
    fontFamily: "PoppinsBlack",
    marginBottom: -20,
    marginTop: -25,
  },
  level_label: {
    color: "white",
    fontFamily: "PoppinsLight",
    fontSize:  16,
    marginBottom: 3,
    marginTop: 5
  },
  bong_img: {
    width: 100,
    height: 170,
    position: "absolute",
    alignSelf: "flex-start",
    marginLeft: -35,
    marginTop: 5,
  },
  joint_img: {
    width: 60,
    height: 180,
    position: "absolute",
    alignSelf: "flex-start",
    marginLeft: -15,
    marginTop: -5,
  },
  vape_img: {
    width: 100,
    height: 170,
    position: "absolute",
    alignSelf: "flex-start",
    marginLeft: -40,
    marginTop: 5,
  },
  add_pressable: {
    padding: 30,
    paddingTop: 40,
    paddingBottom: 40,
    position: "absolute",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginTop: 35,
    right: -25,
    overflow: "hidden"
  },
  fire_icon: {
    color: "white",
    fontSize: 30,
    zIndex: 10
  },
});
