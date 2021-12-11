import React from "react";
import { useEffect, useRef } from "react";
import { useFonts } from "expo-font";
import {
  StyleSheet,
  View,
  Text,
  Switch,
  TouchableWithoutFeedbackBase,
  Image,
  Animated,
  Easing,
} from "react-native";

import ConfigItem from "./ConfigItem";

const Config = ({ statConfig, toggleConfig }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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

  return (
    <Animated.View style={[{ opacity: fadeAnim }, styles.container]}>
      <ConfigItem
        type="joint"
        config={statConfig.joint}
        onToggle={toggleConfig}
      ></ConfigItem>
      <ConfigItem
        type="bong"
        config={statConfig.bong}
        onToggle={toggleConfig}
      ></ConfigItem>
      <ConfigItem
        type="vape"
        config={statConfig.vape}
        onToggle={toggleConfig}
      ></ConfigItem>
    </Animated.View>
  );
};

export default Config;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1E1E1E",
    marginTop: 30,
    justifyContent: "center",
  },
  config_text: {
    color: "white",
    fontFamily: "PoppinsLight",
    fontSize: 18,
    alignSelf: "center",
  },
  config_container: {
    flexDirection: "row",
    marginTop: 20,
  },
  switch: {
    marginLeft: 20,
    paddingLeft: 20,
  },
});
