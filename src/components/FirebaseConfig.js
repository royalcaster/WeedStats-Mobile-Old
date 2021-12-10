import React from "react";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getDatabase, ref, onValue, set } from "firebase/database";

import * as Google from "expo-google-app-auth";

const firebaseConfig = {
  apiKey: "AIzaSyBAlbSfcLmsqz9S_W4J_TCsX_i481My9MM",
  authDomain: "weedstats-1a033.firebaseapp.com",
  databaseURL:
    "https://weedstats-1a033-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "weedstats-1a033",
  storageBucket: "weedstats-1a033.appspot.com",
  messagingSenderId: "158741630717",
  appId: "1:158741630717:android:81d5c7ffc951c450c6f894",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const firestore = getFirestore();

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

export { db, firestore, handleLogin, handleLogOut };
