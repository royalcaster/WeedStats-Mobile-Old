import React from "react";
import { useFonts } from "expo-font";
import AntDesign from "react-native-vector-icons/AntDesign";
import {
  StyleSheet,
  Image,
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
  Picker,
  Animated,
  Easing,
} from "react-native";

const StatsEmpty = () => {
  const [loaded] = useFonts({
    PoppinsBlack: require("./fonts/Poppins-Black.ttf"),
    PoppinsLight: require("./fonts/Poppins-Light.ttf"),
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ alignItems: "center", width: "85%", alignSelf: "center"}}>
        <AntDesign
          name="frowno"
          style={{
            color: "white",
            margin: 10,
            fontSize: 40,
          }}
        />
        <Text style={styles.heading}>Du hast noch keine Einträge gemacht.</Text>
        <View style={{ height: 30 }}></View>
        <Text style={styles.heading2}>
          Verwende die Counter, um deine Statistiken angezeigt zu bekommen.
        </Text>
      </Animated.View>
    </View>
  );
};

export default StatsEmpty;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E1E1E",
    height: "100%",
    width: "100%",
    justifyContent: "center"
  },
  heading: {
    fontFamily: "PoppinsBlack",
    textAlign: "center",
    color: "white",
    fontSize: 20,
  },
  heading2: {
    fontFamily: "PoppinsLight",
    textAlign: "center",
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
  },
});
