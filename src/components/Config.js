import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { Pressable } from "react-native";
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

import Levels from './Levels'

import ConfigItem from "./ConfigItem";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Config = ({ statConfig, toggleConfig }) => {

  const [showLevels, setShowLevels] = useState(false);
  const hideLevels = () => {
    setShowLevels(false);
  }

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
    <>
    {showLevels ? <Levels onexit={hideLevels}></Levels> : <Animated.View style={[{ opacity: fadeAnim }, styles.container]}>
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

            <Pressable onPress={() => setShowLevels(true)} style={ ({pressed}) => [{backgroundColor: pressed ? "#404040" : "#4a4a4a"},styles.signOutButton]}>
              <FontAwesome name="trophy" style={styles.money_icon} />
                <Text style={{
                color: "white",
                fontSize: 18,
                fontFamily: "PoppinsLight",
                textAlign: "center",
                top: 2,
                textAlignVertical: "center"
            }}>  Levelübersicht</Text></Pressable>
    </Animated.View>}
    </>
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
  signOutButton: { 
    width: "80%",
    alignSelf: "center",
    height: 50,
    borderRadius: 100,
    justifyContent: "center",
    marginTop: 20,
    bottom: 20,
    flexDirection: "row"
  },
  money_icon: {
    fontSize: 25,
    color: "white",
    textAlignVertical: "center"
}
});
