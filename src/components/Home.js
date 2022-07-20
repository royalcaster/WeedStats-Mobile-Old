import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  View,
} from "react-native";
import { useFonts } from "expo-font";
import { useState } from "react";


import Stats from "./Stats";
import Main from "./Main";
import Map from "./Map";
import Config from "./Config";
import Groups from "./Groups";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import MenuButton from "./MenuButton";

export default function Home({ user, handleLogOut, toggleCounter }) {

  const [view, setView] = useState("main");

  const navSlide = useRef(new Animated.Value(0)).current;

  const [loaded] = useFonts({
    PoppinsBlack: require("./fonts/Poppins-Black.ttf"),
    PoppinsMedium: require("./fonts/Poppins-Medium.ttf"),
    PoppinsLight: require("./fonts/Poppins-Light.ttf"),
  });

  if (!loaded) {
    return null;
  }

  const toggleNavbar = (x) => {
    x == 1 ? 
    Animated.timing(
      navSlide,{
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }
    ).start()
    : Animated.timing(
      navSlide,{
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }
    ).start();
  }

  return (
    <Animated.View style={[{ opacity: 1 }, styles.container]}>
      <View style={styles.content_container}>
        {view == "main" ? (
          <Main user={user} toggleCounter={toggleCounter} />
        ) : null}
        {view == "stats" ? <Stats user={user}/> : null}
        {view == "map" ? <Map user={user} /> : null}
        {view == "config" ? <Config /> : null}
        {view == "groups" ? (
          <Groups user={user} handleLogOut={handleLogOut} toggleNavbar={toggleNavbar}/>
        ) : null}
      </View>

      <Animated.View style={[styles.footer_container,{transform:[{translateY: navSlide}]}]}>
        <View style={styles.options_container}>
          <View style={{ flexDirection: "row", width: "100%" }}>
            <MenuButton
              onPress={() => {
                setView("stats");
              }}
              selected={view == "stats"}
              title={"Stats"}
              icon={
                <Entypo
                  name="area-graph"
                  style={[
                    { color: view == "stats" ? "#e0e0e0" : "#4a4a4a" },
                    styles.settings_icon,
                  ]}
                />
              }
            />
            <MenuButton
              onPress={() => {
                setView("map");
              }}
              selected={view == "map"}
              title={"Karte"}
              icon={
                <FontAwesome
                  name="map-marker"
                  style={[
                    { color: view == "map" ? "#e0e0e0" : "#4a4a4a" },
                    styles.settings_icon,
                  ]}
                />
              }
            />
            <MenuButton
              type={"img"}
              url={
                view == "main"
                  ? require("./img/logo.png")
                  : require("./img/logo_bw.png")
              }
              onPress={() => {
                setView("main");
              }}
            />
            <MenuButton
              onPress={() => {
                setView("config");
              }}
              selected={view == "config"}
              title={"Settings"}
              icon={
                <FontAwesome
                  name="sliders"
                  style={[
                    { color: view == "config" ? "#e0e0e0" : "#4a4a4a" },
                    styles.settings_icon,
                  ]}
                />
              }
            />
            <MenuButton
              onPress={() => {
                setView("groups");
              }}
              selected={view == "groups"}
              title={"Social"}
              icon={
                <FontAwesome
                  name="user"
                  style={[
                    { color: view == "groups" ? "#e0e0e0" : "#4a4a4a" },
                    styles.settings_icon,
                  ]}
                />
              }
            />
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171717",
    alignItems: "center",
  },
  content_container: {
    width: "100%",
    position: "relative",
    height: "92%",
  },
  settings_icon: {
    fontSize: 25,
    textAlign: "center"
  },
  options_container: {
    width: "100%",
    bottom: 0,
    position: "absolute",
    flexDirection: "column",
    height: "100%",
    backgroundColor: "#1E1E1E",
  },
  options_pressable: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
    height: "100%",
  },
  footer_container: {
    width: "100%",
    height: "8%",
    bottom: 0,
    position: "absolute",
    flexDirection: "row",
    backgroundColor: "#171717",
    justifyContent: "center",
    zIndex: 10,
  }
});
