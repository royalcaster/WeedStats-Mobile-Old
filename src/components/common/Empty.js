import React, { useEffect, useRef } from "react";
import { useFonts } from "expo-font";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Easing
} from "react-native";

const Empty = ({ title, tip }) => {
  /* const [loaded] = useFonts({
    PoppinsBlack: require("./fonts/Poppins-Black.ttf"),
    PoppinsLight: require("./fonts/Poppins-Light.ttf"),
  }); */

  const fadeAnim = useRef(new Animated.Value(100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.bezier(0, 1.02, 0.21, 0.97),
    }).start();
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ alignItems: "center", width: "85%", alignSelf: "center", transform: [{translateY: fadeAnim}], opacity: opacityAnim}}>
        <View style={{flexDirection: "row"}}>
          <Text style={styles.heading}>{title}</Text>
          <Ionicons
            name="sad-outline"
            style={{
              color: "rgba(255,255,255,0.6)",
              margin: 10,
              fontSize: 90,
              textAlignVertical: "center"
            }}
          />
        </View>
        <View style={{ height: 30 }}></View>
        <Text style={styles.heading2}>
          {tip}
        </Text>
      </Animated.View>
    </View>
  );
};

export default Empty;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    justifyContent: "center"
  },
  heading: {
    fontFamily: "PoppinsBlack",
    textAlign: "left",
    color: "rgba(255,255,255,0.6)",
    fontSize: 30,
    width: "50%"
  },
  heading2: {
    fontFamily: "PoppinsLight",
    textAlign: "left",
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    width: "80%"
  },
});
