import React from "react";
import { useEffect, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  Animated,
  Pressable,
  Easing,
  BackHandler,
} from "react-native";
import { useFonts } from "expo-font";
import BackButton from "./BackButton";
import LevelImage from "./LevelImage";
import levels from "../Levels.json";

const Levels = ({ onexit }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Call back function when back button is pressed
  const backActionHandler = () => {
    hide();
    return true;
  };

  useEffect(() => {
    // Add event listener for hardware back button press on Android
    BackHandler.addEventListener("hardwareBackPress", backActionHandler);

    return () =>
      // clear/remove event listener
      BackHandler.removeEventListener("hardwareBackPress", backActionHandler);
  }, []);

  const hide = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.bezier(0, 1.02, 0.21, 0.97),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        onexit();
      }
    });
  };

  const [loaded] = useFonts({
    PoppinsBlack: require("./fonts/Poppins-Black.ttf"),
    PoppinsLight: require("./fonts/Poppins-Light.ttf"),
  });

  return (
    <Animated.View style={[{ opacity: fadeAnim }, styles.container]}>
      <View style={{ height: 50 }}></View>

      <View style={{ marginLeft: 20 }}>
        <BackButton onPress={() => hide()} />
      </View>

      <View style={{ height: 10 }}></View>

      {levels.map((level, index) => {
        return (
          <View
            style={{
              alignSelf: "center",
              borderRadius: 10,
              width: "90%",
              backgroundColor: level.colors[0],
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
              borderColor: index == levels.length - 1 ? "#E6C743" : null,
              borderWidth: index == levels.length - 1 ? 3 : null,
              maxWidth: 700,
            }}
          >
            <LevelImage index={index} style={styles.lvl_img} />
            <View style={{ marginLeft: 15 }}>
              <Text style={styles.lvl_name}>{level.name}</Text>
              {index != levels.length - 1 ? (
                <Text style={styles.lvl_bounds}>
                  {index * 70}-{(index + 1) * 70 - 1}
                </Text>
              ) : (
                <Text style={styles.lvl_bounds}>ab {index * 70}</Text>
              )}
            </View>
          </View>
        );
      })}
      {/* <Button title={"Zurück"} icon={<Feather name="arrow-left" style={styles.cancel_icon}/>} color={"#eb4034"} fontColor={"white"} onPress={() => hide()} borderradius={100}/> */}
    </Animated.View>
  );
};

export default Levels;

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    backgroundColor: "#1E1E1E",
    paddingBottom: 30,
  },
  lvl_img: {
    height: 80,
    width: 80,
    marginLeft: 15,
    marginTop: -10,
  },
  lvl_name: {
    fontSize: 24,
    fontFamily: "PoppinsBlack",
    color: "white",
  },
  lvl_bounds: {
    fontFamily: "PoppinsLight",
    fontSize: 18,
    marginTop: -5,
    color: "white",
  },

  cancelButton: {
    width: "80%",
    alignSelf: "center",
    height: 50,
    borderRadius: 100,
    justifyContent: "center",
    marginTop: 20,
    bottom: 20,
    flexDirection: "row",
  },
  cancel_icon: {
    fontSize: 25,
    color: "white",
    textAlignVertical: "center",
    position: "relative",
    marginTop: 20,
  },
});
