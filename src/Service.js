//Firebase
import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "./components/FirebaseConfig";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"

// Lädt das Nutzer-Objekt aus dem AsyncStorage
const getLocalUser = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("current_user");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log("Error:", e);
  }
};

const user = getLocalUser();
const config = null;
const entries = null;

//gibt Ausssage über Existent des Nutzerobjekts zurück -> nicht über Existenz des Eintrags in der DB!
export const userExists = () => {
 if (user != null) {
  return true;
 }
 else {
  return false;
 }
}

//gibt fertiges Nutzerobjekt zurück
export const getUserObject = async () => {
  await refreshUser();
  return user;
}

// Überschreibt Nutzer-Objekt mit aktuellen Daten
const refreshUser = async () => {
  let local_counters = {
    main: 0,
    joint: 0,
    bong: 0,
    vape: 0,
    pipe: 0,
    cookie: 0,
  };

  try {
    const jsonValue = await AsyncStorage.getItem(user.id + "_counters");
    jsonValue != null ? (local_counters = JSON.parse(jsonValue)) : null;
  } catch (e) {
    console.log("Error in beim Laden des lokalen Nutzers: ", e);
  }

  const docRef = doc(firestore, "users", user.id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    //Nutzerdokument existiert -> Nutzer-State mit Daten füllen
    user = {
      username: docSnap.data().username,
      id: docSnap.data().id,
      email: docSnap.data().email,
      photoUrl: docSnap.data().photoUrl,
      friends: docSnap.data().friends,
      joint_counter: local_counters.joint,
      bong_counter: local_counters.bong,
      vape_counter: local_counters.vape,
      pipe_counter: local_counters.pipe,
      cookie_counter: local_counters.cookie,
      member_since: docSnap.data().member_since,
      last_entry_timestamp: docSnap.data().last_entry_timestamp,
      last_entry_latitude: docSnap.data().last_entry_latitude,
      last_entry_longitude: docSnap.data().last_entry_longitude,
      last_entry_type: docSnap.data().last_entry_type,
      last_feedback: docSnap.data().last_feedback,
      main_counter: local_counters.main,
    };
  } else {
    //Nutzer-Dokument existiert nicht -> loggt sich erstmalig ein -> Dokument erstellen
    try {
      await setDoc(doc(firestore, "users", user.id), {
        username: user.name,
        id: user.id,
        email: user.email,
        photoUrl: user.photoUrl,
        friends: [],
        username_array: createUsernameArray(user.name),
        joint_counter: null,
        bong_counter: null,
        vape_counter: null,
        pipe_counter: null,
        cookie_counter: null,
        last_entry_timestamp: null,
        last_entry_latitude: null,
        last_entry_longitude: null,
        last_entry_type: null,
        last_feedback: null,
        member_since: new Date().toISOString().slice(0, 10),
        main_counter: null,
      });
      const docSnap = await getDoc(doc(firestore, "users", user.id));
      if (docSnap.exists()) {
        user = {
          username: docSnap.data().username,
          id: docSnap.data().id,
          email: docSnap.data().email,
          photoUrl: docSnap.data().photoUrl,
          friends: docSnap.data().friends,
          joint_counter: local_counters.joint,
          bong_counter: local_counters.bong,
          vape_counter: local_counters.vape,
          pipe_counter: local_counters.pipe,
          cookie_counter: local_counters.cookie,
          member_since: docSnap.data().member_since,
          last_entry_timestamp: docSnap.data().last_entry_timestamp,
          last_entry_latitude: docSnap.data().last_entry_latitude,
          last_entry_longitude: docSnap.data().last_entry_longitude,
          last_entry_type: docSnap.data().last_entry_type,
          last_feedback: docSnap.data().last_feedback,
          main_counter: local_counters.main,
        };
      }
    } catch (e) {
      console.log("Error:", e);
      user = null;
    }

    //Einstellungs-Objekt im Local Storage erstmalig einrichten:
    try {
      const value = JSON.stringify({
        showJoint: true,
        showBong: false,
        showVape: true,
        showPipe: false,
        showCookie: true,
        shareMainCounter: true,
        shareTypeCounters: true,
        shareLastEntry: true,
        saveGPS: true,
        shareGPS: false,
        showTutorial: true,
      });
      await AsyncStorage.setItem("settings", value);
    } catch (e) {
      console.log("Error beim erstellen des lokalen Config-Objekt:", e);
    }

    //Counter-Object im Local Storage erstmalig einrichten:
    try {
      const value = JSON.stringify({
        main: 0,
        joint: 0,
        bong: 0,
        vape: 0,
        pipe: 0,
        cookie: 0,
      });
      await AsyncStorage.setItem(user.id + "_counters", value);
    } catch (e) {
      console.log("Error in beim erstellen des lokalen Counter-Objekt: ", e);
    }
  }
};