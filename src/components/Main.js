import React, { useState, useEffect, useRef } from "react";
import CounterItem from "./CounterItem";
import Onboarding from "react-native-onboarding-swiper";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import moment from "moment";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

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
  ActivityIndicator,
} from "react-native";

const Main = ({ user, toggleCounter }) => {
  const headingAnim = useRef(new Animated.Value(-100)).current;

  const leftAnim = useRef(new Animated.Value(-70)).current;
  const rightAnim = useRef(new Animated.Value(70)).current;

  const Tab = createMaterialTopTabNavigator();

  let config = {};
  const [loading, setLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);

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

    loadSettings();
    calcDaysTill420();
    sortCounterOrder();
  }, []);

  const loadSettings = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("settings");
      jsonValue != null ? (config = JSON.parse(jsonValue)) : null;

      let settings = [];
      !config.showJoint ? settings.push("joint") : null;
      !config.showBong ? settings.push("bong") : null;
      !config.showVape ? settings.push("vape") : null;
      !config.showPipe ? settings.push("pipe") : null;
      !config.showCookie ? settings.push("cookie") : null;

      let buffer = counterOrder.filter((item) => !settings.includes(item.type));
      setCounterOrder(buffer);
      setShowTutorial(config.showTutorial);
      setLoading(false);

      config.showTutorial = false;
    } catch (e) {
      console.log("Error in Laden: ", e);
    }
    try {
      const jsonValue = JSON.stringify(config);
      await AsyncStorage.setItem("settings", jsonValue);
    } catch (e) {
      console.log("Error beim Speichern der Config: ", e);
    }
  };

  const [countdown, setCountDown] = useState(0);
  const [counterOrder, setCounterOrder] = useState([
    { type: "joint", counter: user.joint_counter },
    { type: "bong", counter: user.bong_counter },
    { type: "vape", counter: user.vape_counter },
    { type: "pipe", counter: user.pipe_counter },
    { type: "cookie", counter: user.cookie_counter },
  ]);

  const sortCounterOrder = () => {
    counterOrder.sort((a, b) => {
      return b.counter - a.counter;
    });
  };

  const calcDaysTill420 = () => {
    let target = "";
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
  };

  const tutorialSeen = async () => {
    try {
      const jsonValue = JSON.stringify(config);
      await AsyncStorage.setItem("settings", jsonValue);
    } catch (e) {
      console.log("Error in Config beim Speichern: ", e);
    }
    setLoading(false);
    setSaved(true);
  };

  return (
    <>
      {showTutorial ? (
        <Onboarding
          onDone={() => {
            setShowTutorial(false);
          }}
          nextLabel="Weiter"
          skipLabel="Überspringen"
          skipToPage={6}
          titleStyles={styles.main_heading}
          subTitleStyles={styles.blank_text}
          imageContainerStyles={{ paddingBottom: 30 }}
          pages={[
            {
              backgroundColor: "#171717",
              image: (
                <FontAwesome
                  name="hand-peace-o"
                  style={{ fontSize: 150, color: "#e0e0e0" }}
                />
              ),
              title: "Willkommen!",
              subtitle:
                "WeedStats bietet verschiedenste Möglichkeiten zum Erfassen, Auswerten und Teilen deines Gras-Konsums. Diese kurze Tour wird dir die wesentlichen Funktionen der App beibringen.",
            },
            {
              backgroundColor: "#171717",
              image: (
                <Image
                  source={require("./img/logo_w.png")}
                  style={styles.tut_img}
                />
              ),
              title: "Counter",
              subtitle:
                "Jedes mal, wenn du etwas rauchst, solltest du den jeweiligen Counter um eins erhöhen.\nHalte dazu den Button für kurze Zeit gedrückt. Je nach Einstellung wird der Zeitpunkt und die aktuellen GPS-Daten gespeichert.",
            },
            {
              backgroundColor: "#171717",
              image: (
                <FontAwesome
                  name="sliders"
                  style={{ fontSize: 150, color: "#e0e0e0" }}
                />
              ),
              title: "Einstellungen",
              subtitle:
                "Hier kannst du unter u.A. Einstellungen für deine Privatsphäre treffen.",
            },
            {
              backgroundColor: "#171717",
              image: (
                <FontAwesome
                  name="user"
                  style={{ fontSize: 150, color: "#e0e0e0" }}
                />
              ),
              title: "Freunde",
              subtitle:
                "Füge Freunde hinzu, um deine Statistiken mit ihnen zu teilen und das volle Potential von WeedStats auszuschöpfen!\nAußerdem kannst du hier auf deinen Account zugreifen.",
            },
            {
              backgroundColor: "#171717",
              image: (
                <Entypo
                  name="area-graph"
                  style={{ fontSize: 150, color: "#e0e0e0" }}
                />
              ),
              title: "Statistiken",
              subtitle:
                "Hier findest du sowohl statistische Auswertungen und Diagramme zu deinem Konsum als auch eine Liste deiner letzten Einträge.",
            },
            {
              backgroundColor: "#171717",
              image: (
                <FontAwesome
                  name="map-marker"
                  style={{ fontSize: 150, color: "#e0e0e0" }}
                />
              ),
              title: "Map",
              subtitle:
                "Die Karte kann dir entweder eine Heatmap mit den Orten zeigen, an denen du am häufigsten geraucht hast, oder auch die letzten Einträge deiner Freunde.",
            },
            {
              backgroundColor: "#171717",
              image: (
                <Entypo
                  name="light-bulb"
                  style={{ fontSize: 150, color: "#e0e0e0" }}
                />
              ),
              title: "Tipps",
              subtitle:
                "Je gewissenhafter du deinen Konsum in der App einträgst, desto genauer werden deine Statistiken mit der Zeit.\nWir wünschen dir viel Spaß mit WeedStats!",
            },
          ]}
        ></Onboarding>
      ) : (
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
          <View style={{ height: 10 }}></View>

          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size={"large"} color={"#0080FF"} />
            </View>
          ) : (
            <ScrollView style={styles.counters_container}>
              {counterOrder.length == 0 ? (
                <View style={{ justifyContent: "center" }}>
                  <Text>{config.showBong}</Text>
                  <EvilIcons
                    style={{
                      color: "rgba(255,255,255,0.3)",
                      fontSize: 100,
                      marginBottom: 20,
                      alignSelf: "center",
                    }}
                    name="close"
                  />
                  <Text style={[styles.blank_text, { fontSize: 20 }]}>
                    Keine Stats aktiviert
                  </Text>
                  <Text
                    style={[
                      styles.blank_text,
                      { maxWidth: 200, textAlign: "center" },
                    ]}
                  >
                    Konfiguriere deine Ansicht in den{" "}
                    <FontAwesome style={{ fontSize: 20 }} name="sliders" />{" "}
                    Einstellungen.
                  </Text>
                </View>
              ) : (
                counterOrder.map((item) => {
                  return (
                    <CounterItem
                      key={item.type}
                      type={item.type}
                      counter={user[item.type + "_counter"]}
                      toggleCounter={toggleCounter}
                    />
                  );
                })
              )}
            </ScrollView>
          )}
        </>
      )}
    </>
  );
};

export default Main;

const styles = StyleSheet.create({
  counters_container: {
    flex: 5,
    backgroundColor: "#171717",
    width: "100%",
    height: "100%",
  },
  tut_img: {
    height: 200,
    width: 200,
    marginBottom: -35,
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
