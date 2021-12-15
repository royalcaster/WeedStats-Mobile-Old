import React from "react";
import { useFonts } from "expo-font";
import {
  StyleSheet,
  Image,
  View,
  Text,
  Pressable,
  ScrollView,
} from "react-native";

import HistoryTable from "./HistoryTable";

import AntDesign from "react-native-vector-icons/AntDesign";

const StatsHistory = ({ user }) => {
  const [loaded] = useFonts({
    PoppinsBlack: require("./fonts/Poppins-Black.ttf"),
    PoppinsLight: require("./fonts/Poppins-Light.ttf"),
  });

  return (
    <ScrollView style={styles.container}>
      <View style={{ height: 50 }}></View>
      <View style={{ alignItems: "center" }}>
        <AntDesign
          name="clockcircleo"
          style={{ fontSize: 60, color: "white", marginBottom: 5 }}
        />
        <Text style={styles.heading}>Verlauf</Text>
      </View>
      <View style={{ height: 30 }}></View>
      <HistoryTable user={user} />
    </ScrollView>
  );
};

export default StatsHistory;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E1E1E",
    width: "100%",
  },
  heading: {
    fontFamily: "PoppinsBlack",
    color: "white",
    fontSize: 18,
  },
});
