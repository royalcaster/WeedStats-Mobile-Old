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
  Easing
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

const CounterItem = ({ type, counter, toggleCounter }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [buttonPressed, setButtonPressed] = useState(false);

  const buttonFill = useRef(new Animated.Value(0)).current;

  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(scaleAnim,{
      toValue: 1,
      useNativeDriver: true,
      duration: 400,
      easing: Easing.bezier(0,1.02,.21,.97)
    }).start();
  },[]);

  buttonPressed
    ? Animated.timing(buttonFill, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start()
    : Animated.timing(buttonFill, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }).start();

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

  const calcLevelStatus = (counter) => {
    if (counter >= 420) {
      return "100%";
    } else if (counter == 0) {
      return "0%";
    } else {
      var indicator = Math.ceil(counter / 70);
      return (100 * (counter - 70 * (indicator - 1))) / 70 + "%";
    }
  };

  const calcLevelName = (counter) => {
    if (counter == 420) {
      return "Legende";
    } else {
      var indicator = Math.ceil(counter / 70);
      switch (indicator) {
        case 0:
          return "Nappo";
        case 1:
          return "Nappo";
        case 2:
          return "Beginner";
        case 3:
          return "Amateur";
        case 4:
          return "Fortgeschrittener";
        case 5:
          return "Smurf";
        case 6:
          return "Experte";
        default:
          return "Legende";
      }
    }
  };

  const getGradientColors = (x) => {
    var colors;
    x == 0 ? (colors = ["#50d036", "#2f831e"]) : null;
    x == 1 ? (colors = ["#50d036", "#2f831e"]) : null;
    x == 2 ? (colors = ["#c5680f", "#673608"]) : null;
    x == 3 ? (colors = ["#f8b127", "#b47805"]) : null;
    x == 4 ? (colors = ["#279cf8", "#0567b4"]) : null;
    x == 5 ? (colors = ["#6236d0", "#3b1e83"]) : null;
    x == 6 ? (colors = ["#dc27f8", "#9c05b4"]) : null;
    x == 7 ? (colors = ["#f02e2e", "#ad0c0c"]) : null;
    !x ? (colors = ["#50d036", "#2f831e"]) : null
    return colors;
  };

  return (
    <Animated.View style={{transform: [{scale: scaleAnim}]}}>
      
      <LinearGradient
        colors={getGradientColors(Math.ceil(counter / 70))}
        style={{
          width: "80%",
          alignSelf: "center",
          /* backgroundColor: bg_color, */
          alignItems: "center",
          borderRadius: 30,
          marginTop: 20,
          marginBottom: 20,
          maxWidth: 700,
          /* opacity: fadeAnim, */
        }}
      >
        <View style={{borderWidth: 5, borderColor: counter > 419 ? "#E6C743" : "rgba(255,255,255,0)", width: "100%", alignItems: "center", borderRadius: 30}}>
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
        {type === "pipe" ? (
          <Image style={styles.pipe_img} source={require("./img/pipe.png")} />
        ) : null}
        {type === "cookie" ? (
          <Image style={styles.cookie_img} source={require("./img/cookie.png")} />
        ) : null}
        <LevelImage index={Math.ceil(counter / 70)} />
        <Text style={styles.counter_number}>{counter}</Text>
        <Statusbar status={calcLevelStatus(counter)}></Statusbar>
        <Text style={styles.level_label}>{calcLevelName(counter)}</Text>
        <Pressable
          onPressIn={() => setButtonPressed(true)}
          onPressOut={() => setButtonPressed(false)}
          onLongPress={() => {
            toggleCounter(type.toLowerCase());
            setButtonPressed(false);
          }}
          style={({ pressed }) => [
            { backgroundColor: pressed ? "#2b2b2b" : "#383838" },
            styles.add_pressable,
          ]}
        >
          <FontAwesome name="fire" style={styles.fire_icon} />
          <Animated.View
            style={{
              transform: [{ scaleY: buttonFill }],
              height: 220,
              width: 200,
              backgroundColor: "#0080FF",
              zIndex: 9,
              borderRadius: 0,
              top: 0,
              left: 0,
              position: "absolute",
            }}
          ></Animated.View>
        </Pressable>
        
        {/* </Animated.View> */}
        </View>
      </LinearGradient>
    </Animated.View>
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
    fontSize: 16,
    marginBottom: 3,
    marginTop: 5,
  },
  bong_img: {
    width: 80,
    height: 130,
    position: "absolute",
    alignSelf: "flex-start",
    marginLeft: -30,
    marginTop: 25,
  },
  joint_img: {
    width: 50,
    height: 130,
    position: "absolute",
    alignSelf: "flex-start",
    marginLeft: -15,
    marginTop: 25,
  },
  vape_img: {
    width: 70,
    height: 140,
    position: "absolute",
    alignSelf: "flex-start",
    marginLeft: -30,
    marginTop: 15,
  },
  pipe_img: {
    width: 110,
    height: 170,
    position: "absolute",
    alignSelf: "flex-start",
    marginLeft: -35,
    marginTop: -5,
  },
  cookie_img: {
    width: 100,
    height: 110,
    position: "absolute",
    alignSelf: "flex-start",
    marginLeft: -30,
    marginTop: 20,
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
    overflow: "hidden",
  },
  fire_icon: {
    color: "white",
    fontSize: 30,
    zIndex: 10,
  },
});
