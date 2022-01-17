import React, { useState } from "react";
import { useEffect, useRef } from "react";
import CounterItem from "./CounterItem";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import moment from "moment";

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

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
} from "react-native";

import CounterPage from "./CounterPage";

const Main = ({ user, statConfig, toggleCounter }) => {
  const headingAnim = useRef(new Animated.Value(-100)).current;

  const leftAnim = useRef(new Animated.Value(-70)).current;
  const rightAnim = useRef(new Animated.Value(70)).current;

  const Tab = createMaterialTopTabNavigator();

  const [selectedIndex, setSelectedIndex] = useState(0);

  
  useEffect(() => {
    Animated.timing(headingAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.bezier(0.07, 1, 0.33, 0.89),
    }).start();

    Animated.timing(leftAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.bezier(0.07, 1, 0.33, 0.89),
    }).start();

    Animated.timing(rightAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.bezier(0.07, 1, 0.33, 0.89),
    }).start();
  }, []);

  const [countdown, setCountDown] = useState(0);

  var target = "";
  useEffect(() => {
    //Idee: Prüfe, ob es am Tag vor 4:20 ist, oder nach 4:20. Wenn vor, berechne countdown von jetzt bis 4:20, wenn nach, berechne countdown von jetzt bis 4:20 des nächsten tages
    let now = new Date();
    let ft_current_year = new Date(now.getFullYear(), 3, 20, 0, 0);

    if (now.getTime() < ft_current_year.getTime()) {
      let a = moment(now);
      let b = moment(ft_current_year);
      target = b.diff(a, "days");
    } else {
      let ft_next_year = new Date(
        ft_current_year.setFullYear(ft_current_year.getFullYear() + 1)
      );
      let a = moment(now);
      let b = moment(ft_next_year);
      target = b.diff(a, "days");
    }
    setCountDown(target);
  });

  const getGradientColors = ( x ) => {
    var colors;
    x == 0 ? colors = {c1: "#50d036", c2: "#2f831e"} : null;
    x == 1 ? colors = {c1: "#50d036", c2: "#2f831e"} : null;
    x == 2 ? colors = {c1: "#c5680f", c2: "#673608"} : null;
    x == 3 ? colors = {c1: "#f8b127", c2: "#b47805"} : null;
    x == 4 ? colors = {c1: "#279cf8", c2: "#0567b4"} : null;
    x == 5 ? colors = {c1: "#6236d0", c2: "#3b1e83"} : null;
    x == 6 ? colors = {c1: "#dc27f8", c2: "#9c05b4"} : null;
    x == 7 ? colors = {c1: "#f02e2e", c2: "#ad0c0c"} : null;
    return colors;
  }
  

  return (
      <>
      <View style={{ height: 50 }}></View>

      <View style={{ width: "100%", flexDirection: "row" }}>
        <Animated.View
          style={{
            paddingLeft: 15,
            flex: 1,
            top: 10,
            transform: [{ translateX: leftAnim }],
          }}
        >
          <Text
            style={{
              color: "#919191",
              fontFamily: "PoppinsLight",
              marginBottom: -10,
              fontSize: 12,
            }}
          >
            Gesamt
          </Text>
          <Text
            style={{
              fontFamily: "PoppinsBlack",
              fontSize: 25,
              color: "#919191",
            }}
          >
            {user.main_counter}
          </Text>
        </Animated.View>
        <View>
          <Animated.Text
            style={[
              { transform: [{ translateY: headingAnim }] },
              styles.main_heading,
            ]}
          >
            WeedStats
          </Animated.Text>
        </View>
        <Animated.View
          style={{
            paddingRight: 15,
            flex: 1,
            top: 10,
            transform: [{ translateX: rightAnim }],
          }}
        >
          <Text
            style={{
              textAlign: "right",
              color: "#919191",
              fontFamily: "PoppinsLight",
              marginBottom: -10,
              fontSize: 12,
            }}
          >
            Tage bis 420
          </Text>
          <Text
            style={{
              textAlign: "right",
              fontFamily: "PoppinsBlack",
              fontSize: 25,
              color: "#919191",
            }}
          >
            {countdown}
          </Text>
        </Animated.View>
      </View>
      <View style={{height: 10}}></View>

      <ScrollView style={styles.counters_container}>
        {!statConfig.joint && !statConfig.bong && !statConfig.vape ? (
          <View style={{ justifyContent: "center" }}>
            <FontAwesome
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: 80,
                marginTop: 40,
                alignSelf: "center",
              }}
              name="close"
            />
            <Text style={styles.blank_text}>Keine Stats aktiviert!</Text>
            <Text style={styles.blank_text}>
              Konfiguriere deine Ansicht in den{" "}
              <FontAwesome style={{ fontSize: 20 }} name="sliders" />{" "}
              Einstellungen.
            </Text>
          </View>
        ) : (
          <>
            {statConfig.joint ? (
              <CounterItem
                type="joint"
                counter={user.joint_counter}
                toggleCounter={toggleCounter}
                level_status={calcLevelStatus(user.joint_counter)}
                level={calcLevelName(user.joint_counter)}
                level_index={Math.ceil(user.joint_counter / 70)}
                bg_colors={getGradientColors(Math.ceil(user.joint_counter / 70))}
              ></CounterItem>
            ) : null}
            {statConfig.bong ? (
              <CounterItem
                type="bong"
                counter={user.bong_counter}
                toggleCounter={toggleCounter}
                level_status={calcLevelStatus(user.bong_counter)}
                level={calcLevelName(user.bong_counter)}
                level_index={Math.ceil(user.bong_counter / 70)}
                bg_colors={getGradientColors(Math.ceil(user.bong_counter / 70))}
              ></CounterItem>
            ) : null}
            {statConfig.vape ? (
              <CounterItem
                type="vape"
                counter={user.vape_counter}
                toggleCounter={toggleCounter}
                level_status={calcLevelStatus(user.vape_counter)}
                level={calcLevelName(user.vape_counter)}
                level_index={Math.ceil(user.vape_counter / 70)}
                bg_colors={getGradientColors(Math.ceil(user.vape_counter / 70))}
              ></CounterItem>
            ) : null}
          </>
        )}
      </ScrollView>
    </> 
  )};

export default Main;

const calcLevelColor = (counter) => {
  if (counter == 420) {
    return "#D90F0F";
  } else {
    var indicator = Math.ceil(counter / 70);
    switch (indicator) {
      case 0:
        return "#3BA426";
        break;
      case 1:
        return "#3BA426";
        break;
      case 2:
        return "#81440A";
        break;
      case 3:
        return "#c85a14";
        break;
      case 4:
        return "#0781E1";
        break;
      case 5:
        return "#4A26A4";
        break;
      case 6:
        return "#C407E1";
        break;
      case 7:
        return "#D90F0F";
        break;
      default:
        return "#D90F0F";
        break;
    }
  }
};

const calcLevelName = (counter) => {
  if (counter == 420) {
    return "Legende";
  } else {
    var indicator = Math.ceil(counter / 70);
    switch (indicator) {
      case 0:
        return "Nappo";
        break;
      case 1:
        return "Nappo";
        break;
      case 2:
        return "Beginner";
        break;
      case 3:
        return "Amateur";
        break;
      case 4:
        return "Fortgeschrittener";
        break;
      case 5:
        return "Smurf";
        break;
      case 6:
        return "Experte";
        break;
      case 7:
        return "Legende";
        break;
      default:
        return "Legende";
        break;
    }
  }
};

const calcLevelStatus = (counter) => {
  if (counter == 420) {
    return "100%";
  } else {
    var indicator = Math.ceil(counter / 70);
    switch (indicator) {
      case 0:
        return "0%";
        break;
      case 1:
        return (100 * counter) / 70 + "%";
        break;
      case 2:
        return (100 * (counter - 70)) / 70 + "%";
        break;
      case 3:
        return (100 * (counter - 140)) / 70 + "%";
        break;
      case 4:
        return (100 * (counter - 210)) / 70 + "%";
        break;
      case 5:
        return (100 * (counter - 280)) / 70 + "%";
        break;
      case 6:
        return (100 * (counter - 350)) / 70 + "%";
        break;
      case 7:
        return "100%";
        break;
      default:
        return "100%";
        break;
    }
  }
};

const styles = StyleSheet.create({
  counters_container: {
    flex: 5,
    backgroundColor: "#171717",
    width: "100%",
    height: 200,
  },
  blank_text: {
    color: "#787878",
    fontSize: 15,
    alignSelf: "center",
    fontFamily: "PoppinsLight",
    marginTop: 15,
  },
  header_container: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 20,
    position: "relative",
    top: 20,
    justifyContent: "center",
  },
  main_heading: {
    color: "white",
    fontSize: 30,
    fontFamily: "PoppinsBlack",
    position: "relative",
  },
});
