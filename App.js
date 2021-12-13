//React
import React from "react";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedbackBase,
  View,
} from "react-native";

//Components
import Home from "./src/components/Home";
import Login from "./src/components/Login";

//Firebase
import { setDoc, doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { ref, onValue, set } from "firebase/database";

import { db, firestore } from "./src/components/FirebaseConfig";

//Expo
import { Linking } from "expo";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as Google from "expo-google-app-auth";
import * as Location from "expo-location";

//import getUser from './FirebaseConfig

//sonstiges
import { LogBox } from "react-native";
import { getIosPushNotificationServiceEnvironmentAsync } from "expo-application";

try {
  LogBox.ignoreLogs(["Setting a timer for a long period of time"]);
} catch (e) {
  console.log("Error", e);
}

export default function App() {
  const [user, setUser] = useState(null);
  const [statConfig, setStatConfig] = useState(null);

  const refreshUser = async (user) => {
    //Referenz zu Nutzerdokument, durch Google-Username identifiziert
    const docRef = doc(firestore, "users", user.name);
    //Snapshot von diesem Dokument zum Lesen
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUser({
        username: docSnap.data().username,
        email: docSnap.data().email,
        photoUrl: docSnap.data().photoUrl,
        joint_counter: docSnap.data().joint_counter,
        bong_counter: docSnap.data().bong_counter,
        vape_counter: docSnap.data().vape_counter,
        member_since: docSnap.data().member_since,
        main_counter:
          docSnap.data().joint_counter +
          docSnap.data().bong_counter +
          docSnap.data().vape_counter,
      });
      setStatConfig({
        joint: docSnap.data().show_joint,
        bong: docSnap.data().show_bong,
        vape: docSnap.data().show_vape,
      });
    } else {
      //nutzer loggt sich erstmalig ein -> dokument erstellen
      try {
        await setDoc(doc(firestore, "users", user.name), {
          username: user.name,
          email: user.email,
          photoUrl: user.photoUrl,
          joint_counter: 0,
          bong_counter: 0,
          vape_counter: 0,
          show_joint: true,
          show_bong: true,
          show_vape: true,
          member_since: new Date().toISOString().slice(0, 10),
          main_counter: 0,
        });
        console.log(user.photoUrl);
        const docSnap = await getDoc(doc(firestore, "users", user.name));
        if (docSnap.exists()) {
          setUser({
            username: docSnap.data().username,
            email: docSnap.data().email,
            photoUrl: docSnap.data().photoUrl,
            joint_counter: docSnap.data().joint_counter,
            bong_counter: docSnap.data().bong_counter,
            vape_counter: docSnap.data().vape_counter,
            member_since: docSnap.data().member_since,
            main_counter:
              docSnap.data().joint_counter +
              docSnap.data().bong_counter +
              docSnap.data().vape_counter,
          });
          setStatConfig({
            joint: docSnap.data().show_joint,
            bong: docSnap.data().show_bong,
            vape: docSnap.data().show_vape,
          });
        }
      } catch (e) {
        console.log("Error:", e);
      }
    }
  };

  const handleLogOut = async () => {
    try {
      await Google.logOutAsync({
        androidClientId:
          "31827165734-rdbihglcac1juesc6fkjd4bgp1c1oj2s.apps.googleusercontent.com",
        scopes: ["profile", "email"],
      });
    } catch (e) {
      console.log("Error:", e);
    }
    setUser(null);
  };

  const handleLogin = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId:
          "31827165734-rdbihglcac1juesc6fkjd4bgp1c1oj2s.apps.googleusercontent.com",
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        try {
          await refreshUser(result.user);
          /* setUser({
          username: result.user.name
        }); */
        } catch (e) {
          console.log("Error:", e);
        }

        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };

  const writeDb = async (type) => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    set(
      ref(db, "users/" + user.username + "/entry_" + (user.main_counter + 1)),
      {
        type: type,
        timestamp: Timestamp.now().seconds,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }
    );
  };

  const toggleCounter = async (index) => {
    //Referenz zu Nutzerdokument, durch Google-Username identifiziert
    const docRef = doc(firestore, "users", user.username);
    //Snapshot von diesem Dokument zum Lesen
    const docSnap = await getDoc(docRef);

    switch (index) {
      case "joint":
        await updateDoc(docRef, {
          joint_counter: docSnap.data().joint_counter + 1,
        });
        writeDb("joint");
        break;
      case "bong":
        await updateDoc(docRef, {
          bong_counter: docSnap.data().bong_counter + 1,
        });
        writeDb("bong");
        break;
      case "vape":
        await updateDoc(docRef, {
          vape_counter: docSnap.data().vape_counter + 1,
        });
        writeDb("vape");
        break;
    }

    await updateDoc(docRef, {
      main_counter: docSnap.data().main_counter + 1,
    });
    const docSnap_new = await getDoc(docRef);
    setUser({
      ...user,
      main_counter: docSnap_new.data().main_counter,
      joint_counter: docSnap_new.data().joint_counter,
      bong_counter: docSnap_new.data().bong_counter,
      vape_counter: docSnap_new.data().vape_counter,
    });
  };

  const toggleConfig = async (index) => {
    //Referenz zu Nutzerdokument, durch Google-Username identifiziert
    const docRef = doc(firestore, "users", user.username);
    //Snapshot von diesem Dokument zum Lesen
    const docSnap = await getDoc(docRef);
    try {
      switch (index) {
        case "joint":
          await updateDoc(docRef, {
            show_joint: !docSnap.data().show_joint,
          });
          const docSnap_1 = await getDoc(docRef);
          setStatConfig({ ...statConfig, joint: docSnap_1.data().show_joint });
          break;
        case "bong":
          await updateDoc(docRef, {
            show_bong: !docSnap.data().show_bong,
          });
          const docSnap_2 = await getDoc(docRef);
          setStatConfig({ ...statConfig, bong: docSnap_2.data().show_bong });
          break;
        case "vape":
          await updateDoc(docRef, {
            show_vape: !docSnap.data().show_vape,
          });
          const docSnap_3 = await getDoc(docRef);
          setStatConfig({ ...statConfig, vape: docSnap_3.data().show_vape });
          break;
      }
    } catch (e) {
      console.log("Error", e);
    }
  };

  const [loaded] = useFonts({
    PoppinsBlack: require("./assets/fonts/Poppins-Black.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <>
      {user ? (
        <Home
          user={user}
          statConfig={statConfig}
          toggleConfig={toggleConfig}
          handleLogOut={handleLogOut}
          toggleCounter={toggleCounter}
        />
      ) : (
        <Login handleLogin={handleLogin} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
});
