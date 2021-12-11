import React, { useState } from "react";
import { useEffect, useRef } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import moment from "moment";

//Unterkomponenten
import StatsDashboard from "./StatsDashboard";
import StatsGraphs from "./StatsGraphs";
import StatsHistory from "./StatsHistory";

//TabView
import Swiper from 'react-native-swiper'

import {
  StyleSheet,
  Text,
  TouchableWithoutFeedbackBase,
  View,
  Image,
  ScrollView,
  Pressable,
  Animated,
  Easing,
  SafeAreaView,
  FlatList,
} from "react-native";

const Stats = ({ user, statConfig, toggleCounter }) => {

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.bezier(0.07, 1, 0.33, 0.89),
    }).start();
  }, []);

  return (
    <Animated.View style={[{opacity: fadeAnim}, styles.container]}>

      <View style={{height: 50}}></View>
      <View style={styles.navbar}>
        <Text></Text>
      </View>
      
      <Swiper style={styles.wrapper} showsButtons={true}>
        <View style={styles.slide}>
          <StatsDashboard />
        </View>
        <View style={styles.slide}>
          <StatsGraphs />
        </View>
        <View style={styles.slide}>
          <StatsHistory />
        </View>
      </Swiper>

    </Animated.View>
  );
};

export default Stats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  //Tab-View
  wrapper: {},
  slide: {
    flex: 1,
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E1E'
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  }
});
