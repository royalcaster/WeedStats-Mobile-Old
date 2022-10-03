//React
import React, { useState, useRef, useContext } from "react";
import {
  Animated,
  StatusBar,
  StyleSheet,
  Vibration,
  View,
} from "react-native";

//Custom Components
import Stats from "./Stats/Stats";
import Main from "./Main/Main";
import Map from "./Map/Map";
import Config from "./Config/Config";
import Groups from "./Friends/Groups";
import MenuButton from "./MenuButton";

//Third Party
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";

export default function Home({ handleLogOut, toggleCounter, toggleLanguage, deleteAccount, getFriendList }) {

  const [view, setView] = useState("main");
  const navSlide = useRef(new Animated.Value(0)).current;

  const [borderColor, setBorderColor] = useState("#1E2132");

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

  const toggleBorderColor = ( color ) => {
    setBorderColor(color);
    StatusBar.setBackgroundColor(color);
    setTimeout(() => {setBorderColor("#1E2132")}, 300);
  }

  return (
    <Animated.View style={[{ opacity: 1, borderColor: borderColor }, styles.container]}>
      <View style={styles.content_container}>
        {view == "main" ? (
          <Main toggleCounter={toggleCounter} toggleBorderColor={toggleBorderColor}/>
        ) : null}
        {view == "stats" ? <Stats/> : null}
        {view == "map" ? <Map/> : null}
        {view == "config" ? <Config toggleLanguage={toggleLanguage}/> : null}
        {view == "groups" ? (
          <Groups handleLogOut={handleLogOut} toggleNavbar={toggleNavbar} deleteAccount={deleteAccount} getFriendList={getFriendList}/>
        ) : null}
      </View>

      <Animated.View style={[styles.footer_container,{transform:[{translateY: navSlide}]}]}>
        <View style={styles.options_container}>
          <View style={{ flexDirection: "row", width: "100%"}}>
            <MenuButton
              onPress={() => {
                Vibration.vibrate(25);
                setView("stats");
              }}
              selected={view == "stats"}
              title={"Stats"}
              icon={
                <Entypo
                  name="area-graph"
                  style={[
                    { color: view == "stats" ? "#e0e0e0" : "#484F78" },
                    styles.settings_icon,
                  ]}
                />
              }
            />
            <MenuButton
              onPress={() => {
                Vibration.vibrate(25);
                setView("map");
              }}
              selected={view == "map"}
              title={"Karte"}
              icon={
                <FontAwesome
                  name="map-marker"
                  style={[
                    { color: view == "map" ? "#e0e0e0" : "#484F78" },
                    styles.settings_icon,
                  ]}
                />
              }
            />
            <MenuButton
              type={"img"}
              url={
                view == "main"
                  ? require("../../data/img/logo.png")
                  : require("../../data/img/logo_bw.png")
              }
              onPress={() => {
                Vibration.vibrate(25);
                setView("main");
              }}
            />
            <MenuButton
              onPress={() => {
                Vibration.vibrate(25);
                setView("config");
              }}
              selected={view == "config"}
              title={"Settings"}
              icon={
                <FontAwesome
                  name="sliders"
                  style={[
                    { color: view == "config" ? "#e0e0e0" : "#484F78" },
                    styles.settings_icon,
                  ]}
                />
              }
            />
            <MenuButton
              onPress={() => {
                Vibration.vibrate(25);
                setView("groups");
              }}
              selected={view == "groups"}
              title={"Social"}
              icon={
                <FontAwesome
                  name="user"
                  style={[
                    { color: view == "groups" ? "#e0e0e0" : "#484F78" },
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
    backgroundColor: "#1E2132",
    alignItems: "center",
    borderRadius: 40,
    borderWidth: 2,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
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
    height: "100%"
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
    bottom: -2,
    position: "absolute",
    flexDirection: "row",
    backgroundColor: "#1E2132",
    justifyContent: "center",
    zIndex: 10,
  }
});
