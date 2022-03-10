import React, { useState } from "react";
import { useEffect, useRef } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import EvilIcons from "react-native-vector-icons/EvilIcons";

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
  TextBase,
  TouchableNativeFeedback
} from "react-native";

import AntDesign from "react-native-vector-icons/AntDesign";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { enableMultiTabIndexedDbPersistence } from "firebase/firestore";

const Stats = ({ user }) => {
  const [view, setView] = useState("dashboard");
  const [localData, setLocalData] = useState([]);
  const [localDataLoaded, setLocalDataLoaded] = useState(false);

  useEffect(() => {
    localDataLoaded ? null : getLocalData();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.bezier(0.07, 1, 0.33, 0.89),
    }).start();
  }, []);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Zum Löschen einzelner Daten aus der History. Erstmal entfernt, da die Konsistenz der Daten nach aktuellem Stand darunter leidet
  const deleteEntry = async (delEntry) => {
    console.log(
      "Die Lösch-Funktion wurde temporär deaktiviert, bis ein sicheres Verfahren gefunden wurde."
    );
    /* try {
      console.log(delEntry.number);
      await AsyncStorage.removeItem(user.id + "_entry_" + delEntry.number);
      setLocalData(
        localData.filter((entry) => entry.number != delEntry.number)
      );
      if (delEntry.number == user.main_counter) {
        await deleteEntryGlobally(
          delEntry.type,
          localData[user.main_counter - 1]
        );
      } else {
        await deleteEntryGlobally(delEntry.type);
      }
    } catch (e) {
      console.log("Error:", e);
    } */
  };

  // TODO: Weiterleiten auf Maps-Seite und Zoom auf Koordinaten des Eintrags (+ Marker setzen)
  const showOnMap = (entry) => {
    console.log("Nummer: " + entry.number);
    console.log("Latitude: " + entry.latitude);
    console.log("Longitude: " + entry.longitude);
  };

  const getRelevantKeys = async () => {
    let keys = [];
    try {
      keys = await AsyncStorage.getAllKeys();
    } catch (e) {
      console.log("Error:", e);
    }

    return keys.filter((key) => key.includes(user.id + "_entry_"));
  };

  const getLocalData = async () => {
    try {
      const jsonData = await AsyncStorage.multiGet(await getRelevantKeys());
      jsonData.forEach((entry) => localData.push(JSON.parse(entry[1])));
      localData.sort((a, b) => {
        return a.number - b.number;
      });
      setLocalDataLoaded(true);
    } catch (e) {
      console.log("Error:", e);
    }
  };

  /*     const dbData = async () => {
    const snapshot = await get(dbUserRef);
    snapshot.forEach((childSnapshot) => {
      localData.push({
        type: childSnapshot.val().type,
        timestamp: childSnapshot.val().timestamp,
        latitude: childSnapshot.val().latitude,
        longitude: childSnapshot.val().longitude,
      });
    });
    console.log("localData geladen!");
    setLocalDataLoaded(true);
  };

  const getHistory = () => {
    onChildAdded(dbHistoryRef, (snapshot) => {
      history.unshift({
        key: snapshot.key,
        number: snapshot.val().number, // dieser Eintrag in der DB wird wahrscheinlich nicht mehr benötigt.
        type: snapshot.val().type,
        date: new Date(snapshot.val().timestamp).toLocaleDateString("de-DE"),
        time: new Date(snapshot.val().timestamp).toLocaleTimeString("de-DE"),
      });
    });
    console.log("history geladen!");
    setHistoryLoaded(true);
  }; */

  return (
    <Animated.View style={[{ opacity: fadeAnim }, styles.container]}>
      <View style={{ height: 50 }}></View>
      {!localDataLoaded ? (
        <ActivityIndicator animating={true} size="large" color="#0080FF" />
      ) : (
        <View style={{ flexDirection: "row" }}>
          <View style={[styles.nav_pressable,{borderTopWidth: 2, borderTopColor: view == "dashboard" ? "#0080FF" : "rgba(255,255,255,0.15)"}]}>
          <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple("rgba(255,255,255,0.15)", false)}
            onPress={() => setView("dashboard")}
          >
            <View style={styles.touchable}>
            <AntDesign
              name="barschart"
              style={{
                color: view == "dashboard" ? "#0080FF" : "#c4c4c4",
                marginBottom: 10,
                fontSize: 30,
                height: "100%",
                textAlignVertical: "center"
              }}
            />
            </View>
          </TouchableNativeFeedback>
          </View>

          <View style={[styles.nav_pressable,{borderTopWidth: 2, borderTopColor: view == "history" ? "#0080FF" : "rgba(255,255,255,0.15)"}]}>    
          <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple("rgba(255,255,255,0.15)", false)}
            onPress={() => setView("history")}
            style={({ pressed }) => [
              {
                borderTopColor: view == "history" ? "#0080FF" : "#171717",
                backgroundColor: pressed ? "#1c1c1c" : "#1E1E1E",
              },
              styles.nav_pressable,
            ]}
          >
            <View style={styles.touchable}>
            <EvilIcons
              name="clock"
              style={{
                color: view == "history" ? "#0080FF" : "#c4c4c4",
                marginBottom: 10,
                fontSize: 30,
                height: "100%",
                textAlignVertical: "center"
              }}
            />
            </View>
          </TouchableNativeFeedback>
          </View>

        </View>
      )}

      {localDataLoaded && view == "dashboard" ? (
        <StatsDashboard user={user} localData={localData} />
      ) : null}
      {localDataLoaded && view == "history" ? (
        <StatsHistory history={localData} showOnMap={showOnMap} />
      ) : null}
    </Animated.View>
  );
};

export default Stats;

const styles = StyleSheet.create({
  container: {
    borderBottomColor: "green",
    borderBottomWidth: 2,
    width: "100%",
    justifyContent: "center",
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
    borderTopWidth: 0,
    alignItems: "center",
    backgroundColor: "#1E1E1E"
  },
  nav_text: {
    textAlign: "center",
    fontFamily: "PoppinsBlack",
    fontSize: 18,
    marginTop: 5,
    marginBottom: -5,
  },
  loading_text: {
    fontFamily: "PoppinsLight",
    fontSize: 18,
    color: "#c4c4c4",
    textAlign: "center",
  },
  touchable: {
    height: 50,
    width: "100%",
    alignItems: "center"
  }
});
