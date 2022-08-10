import React from "react";
import { useEffect, useRef, useState } from "react";
import { useFonts } from "expo-font";
import Statusbar from "./StatusBar/Statusbar";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import LevelImage from "../../../common/LevelImage";
import levels from "../../../../data/Levels.json";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Animated,
  Easing,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

const CounterItem = ({ type, counter, toggleCounter }) => {
  const [buttonPressed, setButtonPressed] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonFill = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      duration: 400,
      easing: Easing.bezier(0, 1.02, 0.21, 0.97),
    }).start();
  }, []);

  buttonPressed
    ? Animated.timing(buttonFill, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start()
    : Animated.timing(buttonFill, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

 /*  const [loaded] = useFonts({
    PoppinsBlack: require("./fonts/Poppins-Black.ttf"),
    PoppinsLight: require("./fonts/Poppins-Light.ttf"),
  }); */

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
    let indicator = Math.floor(counter / 70);
    return indicator > levels.length - 1
      ? levels[levels.length - 1].name
      : levels[0].name;
  };

  const getGradientColors = (counter) => {
    let indicator = Math.floor(counter / 70);
    return indicator > levels.length - 1
      ? levels[levels.length - 1].colors
      : levels[0].colors;
  };

  const grow = () => {
    Animated.timing(
      scaleAnim,
      {
        toValue: 1.05,
        duration: 200,
        useNativeDriver: true,
      }
    ).start();
  }

  const shrink = () => {
    Animated.timing(
      scaleAnim,
      {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }
    ).start();
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>

      <LinearGradient
        colors={getGradientColors(counter)}
        style={{
          width: "80%",
          alignSelf: "center",
          alignItems: "center",
          borderRadius: 15,
          marginTop: 20,
          marginBottom: 20,
          maxWidth: 700,
        }}
      >
        
        <View
          style={{
            borderWidth: 5,
            borderColor: counter > 419 ? "#E6C743" : "rgba(255,255,255,0)",
            width: "100%",
            alignItems: "center",
            borderRadius: 15,
          }}
        >

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
            <Image
              style={styles.joint_img}
              source={require("../../../../data/img/joint.png")}
            />
          ) : null}
          {type === "bong" ? (
            <Image style={styles.bong_img} source={require("../../../../data/img/bong.png")} />
          ) : null}
          {type === "vape" ? (
            <Image style={styles.vape_img} source={require("../../../../data/img/vape.png")} />
          ) : null}
          {type === "pipe" ? (
            <Image style={styles.pipe_img} source={require("../../../../data/img/pipe.png")} />
          ) : null}
          {type === "cookie" ? (
            <Image
              style={styles.cookie_img}
              source={require("../../../../data/img/cookie.png")}
            />
          ) : null}
          <LevelImage index={Math.floor(counter / 70)} />
          <Text style={styles.counter_number}>{counter}</Text>
          <Statusbar status={calcLevelStatus(counter)}></Statusbar>
          <Text style={styles.level_label}>{calcLevelName(counter)}</Text>
          <Pressable
            onPressIn={() => {setButtonPressed(true); grow();}}
            onPressOut={() => {setButtonPressed(false); shrink();}}
            onLongPress={() => {
              toggleCounter(type.toLowerCase());
              setButtonPressed(false);
            }}
            style={({ pressed }) => [
              { backgroundColor: pressed ? "#131520" : "#131520" },
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
  progress: {
    backgroundColor: "#0080FF",
    height: "100%",
    width: "100%",
    position: "absolute",
    borderRadius: 30,
    width: "83%",
    alignSelf: "center"
  }
});
