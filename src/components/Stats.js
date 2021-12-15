import React, { useState } from "react";
import { useEffect, useRef } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import moment from "moment";

import { ref, onValue, query, limitToLast } from "firebase/database";
import { db } from "./FirebaseConfig";

//Unterkomponenten
import StatsDashboard from "./StatsDashboard";
import StatsHistory from "./StatsHistory";

//TabView
import Swiper from "react-native-swiper";

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
  ActivityIndicator,
  TextBase
} from "react-native";

const Stats = ({ user }) => {

  const [view, setView] = useState("dashboard");

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.bezier(0.07, 1, 0.33, 0.89),
    }).start();
    getHistoy();
  }, []);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [loading, setLoading] = useState(true);
  
//History auslesen
const dbUserRef = query(ref(db, "users/" + user.username), limitToLast(10));

const [history, setHistory] = useState([]); 
 
const getHistoy = async () => {
  onValue(dbUserRef, (snapshot) => {
    snapshot.forEach((daten) => {
      history.push({ 
        number: daten.val().number,
        type: daten.val().type,
        date: new Date(daten.val().timestamp).toLocaleDateString("de-DE"),
        time: new Date(daten.val().timestamp).toLocaleTimeString("de-DE")
      });
    });
  });
  setLoading(false);
  console.log("Verlauf geladen!-----------")
}

  return (
    <Animated.View style={[{ opacity: fadeAnim }, styles.container]}>
      <View style={{height: 50}}></View>
      <View style={{flexDirection: "row"}}>

        <Pressable onPress={() => setView("dashboard")} style={({pressed}) => [{
          borderTopColor: view == "dashboard" ? "#0080FF" : "#171717", borderTopWidth: 2, backgroundColor: pressed ? "#1c1c1c" : "#1E1E1E"
        },styles.nav_pressable]}>
          <Text style={[{color: view == "dashboard" ? "#0080FF" : "#c4c4c4"},styles.nav_text]}>Dashboard</Text>
        </Pressable>

        <Pressable onPress={() => setView("history")} style={({pressed}) => [{
          borderTopColor: view == "history" ? "#0080FF" : "#171717", borderTopWidth: 2, backgroundColor: pressed ? "#1c1c1c" : "#1E1E1E"
        },styles.nav_pressable]}>
          <Text style={[{color: view == "history" ? "#0080FF" : "#c4c4c4"},styles.nav_text]}>Verlauf</Text>
        </Pressable>

      </View>

    {loading ? <View style={{backgroundColor: "#1E1E1E", justifyContent: "center", height: "100%", zIndex: 10, position: "absolute", width: "100%"}}><ActivityIndicator size="large" color="#0080FF"/></View> : null }
      {/* <Swiper style={styles.wrapper} showsButtons={false}>
        <View style={styles.slide}>
          <StatsDashboard />
        </View>
        <View style={styles.slide}>
          <StatsHistory user={user} history={history}/>
        </View>
      </Swiper> */}

      {view == "dashboard" ? <StatsDashboard /> : null}
      {view == "history" ? <StatsHistory user={user} history={history.reverse()}/> : null}
      
    </Animated.View>
  );
};

export default Stats;

const styles = StyleSheet.create({
  container: {
    borderBottomColor: "green",
    borderBottomWidth: 2,
    width: "100%",
    height: "102%",
  },
  //Tab-View
  wrapper: {},
  slide: {
    width: "100%",
    height: "94%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  nav_pressable: {
    flex: 1,
  },
  nav_text: {
    textAlign: "center",
    fontFamily: "PoppinsLight",
    fontSize: 18,
    marginTop: 15,
    marginBottom: 15
  }
});
