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
    <ScrollView style={styles.container}>
      <Animated.View style={{ alignItems: "center" }}>
        <View style={{ height: 50 }}></View>
        <Text style={styles.heading}>Du hast noch keine Einträge gemacht.</Text>
        <AntDesign
          name="frowno"
          style={{
            color: "rgba(255,255,255,0.5)",
            margin: 20,
            fontSize: 80,
          }}
        />
        <Text style={styles.heading2}>
          Verwende die Counter, um deine Statistiken angezeigt zu bekommen.
        </Text>
      </Animated.View>
    </ScrollView>
  );
};

export default StatsEmpty;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E1E1E",
    width: "100%",
  },
  heading: {
    fontFamily: "PoppinsBlack",
    textAlign: "center",
    color: "#c4c4c4",
    fontSize: 20,
  },
  heading2: {
    fontFamily: "PoppinsLight",
    textAlign: "center",
    color: "rgba(255,255,255,0.5)",
    fontSize: 16,
  },
});
