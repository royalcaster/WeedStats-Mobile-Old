import React from "react";
import { useRef, useEffect } from "react";
import { useFonts } from "expo-font";
import {
  StyleSheet,
  Image,
  View,
  FlatList,
  Text,
  Pressable,
  ScrollView,
  Animated,
  Easing,
} from "react-native";

import HistoryItem from "./HistoryItem";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const StatsHistory = ({ history, showOnMap }) => {
  const [loaded] = useFonts({
    PoppinsBlack: require("./fonts/Poppins-Black.ttf"),
    PoppinsLight: require("./fonts/Poppins-Light.ttf"),
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.bezier(0.07, 1, 0.33, 0.89),
    }).start();
  }, []);

  const renderItem = ({ item }) => (
    <HistoryItem event={item} showOnMap={showOnMap} />
  );

  return (
    <>
      <View style={{ height: 10 }}></View>

      <FlatList
        data={history.slice().reverse()}
        renderItem={renderItem}
        keyExtractor={(item) => item.number}
      />
    </>
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
  heading: {
    fontFamily: "PoppinsBlack",
    color: "#c4c4c4",
    fontSize: 20,
    marginLeft: 10,
  },
});
