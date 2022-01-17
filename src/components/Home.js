import React from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableWithoutFeedbackBase,
  View,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";
import { useFonts } from "expo-font";
import { useState, useRef } from "react";
import { Appearance, useColorScheme } from "react-native";

import Stats from "./Stats";
import Main from "./Main";
import Map from './Map';
import Config from "./Config";
import Groups from "./Groups";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import Button from "./Button";
import MenuButton from "./MenuButton";

export default function Home({
  user,
  statConfig,
  toggleConfig,
  handleLogOut,
  toggleCounter,
}) {
  const device_width = Dimensions.get("window").width;

  const [view, setView] = useState("main");

  const [loaded] = useFonts({
    PoppinsBlack: require("./fonts/Poppins-Black.ttf"),
    PoppinsMedium: require("./fonts/Poppins-Medium.ttf"),
    PoppinsLight: require("./fonts/Poppins-Light.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content_container}>
        {view == "main" ? (
          <Main
            user={user}
            statConfig={statConfig}
            toggleCounter={toggleCounter}
          />
        ) : null}
        {view == "stats" ? <Stats user={user} /> : null}
        {view == "map" ? <Map /> : null}
        {view == "config" ? (
          <Config statConfig={statConfig} toggleConfig={toggleConfig} />
        ) : null}
        {view == "groups" ? (
          <Groups user={user} handleLogOut={handleLogOut} />
        ) : null}
      </View>

      <View style={styles.footer_container}>
        <View style={styles.options_container}>
          <MenuButton onPress={() => {setView("stats");}} selected={view == "stats"} title={"Stats"} icon={<Entypo name="area-graph" style={[{ color: view == "stats" ? "#e0e0e0" : "#4a4a4a" },styles.settings_icon]}/>}/>
          <MenuButton onPress={() => {setView("map");}} selected={view == "map"} title={"Karte"} icon={<FontAwesome name="map-marker" style={[{ color: view == "map" ? "#e0e0e0" : "#4a4a4a" }, styles.settings_icon,]}/>}/>
          <MenuButton type={"img"} url={view == "main" ? require("./img/logo.png") : require("./img/logo_bw.png")} onPress={() => {setView("main");}}/>
          <MenuButton onPress={() => {setView("config");}} selected={view == "config"} title={"Settings"} icon={<FontAwesome name="sliders" style={[{ color: view == "config" ? "#e0e0e0" : "#4a4a4a" }, styles.settings_icon,]}/>}/>
          <MenuButton onPress={() => {setView("groups");}} selected={view == "groups"} title={"Social"} icon={<FontAwesome name="user" style={[{ color: view == "groups" ? "#e0e0e0" : "#4a4a4a" }, styles.settings_icon,]}/>}/>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    alignItems: "center",
  },
  header_container: {
    flexDirection: "row",
    width: "100%",
    height: "20%",
    position: "absolute",
    top: 50,
    marginBottom: 20,
    justifyContent: "center",
  },
  main_heading: {
    color: "white",
    fontSize: 30,
    fontFamily: "PoppinsBlack",
  },
  content_container: {
    width: "100%",
    position: "relative",
    height: "92%",
  },
  counters_container: {
    flex: 5,
    backgroundColor: "#1E1E1E",
    width: "100%",
    marginTop: 10,
    height: 200,
  },
  main_heading_logo: {
    width: 45,
    height: 45,
    display: "flex",
    marginLeft: 20,
  },
  settings_icon_text: {
    flexDirection: "row",
    marginLeft: "auto",
    marginRight: 20,
    marginTop: 7,
    paddingLeft: 20,
    paddingRight: 20,
  },
  settings_icon: {
    fontSize: 25,
    textAlign: "center",
    paddingBottom: 0,
    paddingTop: 0,
    marginBottom: 10,
  },
  options_container: {
    width: "100%",
    bottom: 0,
    position: "absolute",
    flexDirection: "row",
    maxWidth: 700,
    height: "100%",
    backgroundColor: "#1E1E1E",
  },
  pressable_logo: {
    height: 30,
    width: 30,
    position: "relative",
    marginRight: 5,
    alignSelf: "center",
    marginTop: -5,
  },
  options_pressable: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
    height: "100%",
    borderRadius: 100,
    padding: -15,
  },
  options_pressable_text: {
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 16,
    fontFamily: "PoppinsLight",
    color: "#b8b8b8",
    marginBottom: 10,
  },
  close_icon: {
    color: "white",
    fontSize: 25,
    alignSelf: "center",
  },
  pressables: {
    width: "100%",
    height: "30%",
    flexDirection: "row",
  },
  pressable_profileimg: {
    height: 70,
    width: 70,
    alignSelf: "center",
    marginBottom: 5,
  },
  footer_container: {
    width: "100%",
    height: "8%",
    bottom: 0,
    position: "absolute",
    flexDirection: "row",
    backgroundColor: "#171717",
    justifyContent: "center",
  },
  options_pressable_label: {
    fontFamily: "PoppinsLight",
    fontSize: 12,
    alignSelf: "center",
    marginTop: -7,
  },
});
