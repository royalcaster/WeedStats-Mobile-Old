//React
import React from "react";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Platform,
  Text,
  View,
  Modal,
  Vibration,
  StatusBar
} from "react-native";
import { LogBox } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Custom Components
import Home from "./src/components/Home/Home";
import Login from "./src/components/Login/Login";
import sayings from "./src/data/Sayings.json";
import Splash from "./src/components/Splash/Splash";
import CustomLoader from "./src/components/common/CustomLoader";
import Authenticator from "./src/components/common/Authenticator";
import CounterModal from "./src/components/common/CounterModal";

//Firebase
import { setDoc, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "./src/data/FirebaseConfig";
import { AppRegistry } from "react-native";

//Expo
import { useFonts } from "expo-font";
import * as Google from "expo-google-app-auth";
import * as Location from "expo-location";

//Service
import { UserContext } from "./src/data/UserContext";
import { LanguageContext } from "./src/data/LanguageContext";
import Languages from './src/data/languages.json'
import Intro from "./src/components/common/Intro";
import { FriendListContext } from "./src/data/FriendListContext";
import { ConfigContext } from "./src/data/ConfigContext";


try {
  LogBox.ignoreLogs(["Setting a timer for a long period of time"]);
} catch (e) {
  console.log("Error", e);
}

AppRegistry.registerComponent("main", () => App);

export default function App() {

  //States für Frontend
  const [showSplash, setShowSplash] = useState(true);
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [writeComplete, setWriteComplete] = useState(false);
  const [loadingColor, setLoadingColor] = useState("#0080FF");

  //States für Daten
  const [config, setConfig] = useState(null);
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState(Languages.de);

  const [friendList, setFriendList] = useState([]);
  const [sayingNr, setSayingNr] = useState(0);

  useEffect(async () => {
    loadSettings();
    await checkForUser();
    await getFriendList();
  },[]);

  useEffect(() => {
    if (config != null) {
      config.language == "de" ? setLanguage(Languages.de) : setLanguage(Languages.en);
    }
  },[config]);

  //Holt Einstellungen aus dem AsyncStorage
  const loadSettings = async () => {
    setLoading(true);
    try {
      const jsonValue = await AsyncStorage.getItem("settings");

      if (jsonValue == null) {
        //Settings-Objekt erstmalig einrichten
        await AsyncStorage.setItem("settings",JSON.stringify({
          "first": true,
          "language": "en",
          "localAuthenticationRequired": false,
          "saveGPS": false,
          "shareGPS": false,
          "shareLastEntry": false,
          "shareMainCounter": false,
          "shareTypeCounters": false,
          "showBong": true,
          "showCookie": false,
          "showJoint": true,
          "showPipe": true,
          "showVape": true,
        }))
        setConfig({
          "first": true,
          "language": "en",
          "localAuthenticationRequired": false,
          "saveGPS": false,
          "shareGPS": false,
          "shareLastEntry": false,
          "shareMainCounter": false,
          "shareTypeCounters": false,
          "showBong": true,
          "showCookie": false,
          "showJoint": true,
          "showPipe": true,
          "showVape": true,
        });
      }
      setConfig(JSON.parse(jsonValue));
      setLoading(false);
    } catch (e) {
      console.log("Error in Config beim Laden: ", e);
    }
    console.log("Einstellungen geladen");
    setLoading(false);
  };

  //Sucht im AsyncStorage nach dem letzten User der sich eingeloggt hat und loggt sich bei Erfolg automatisch ein
  const checkForUser = async () => {
    setLoading(true);
    const current_user = await getCurrentUser();
    current_user != null ? refreshUser(current_user) : null;
    setLoading(false);
  }

  // Lädt das User-Objekt aus dem AsyncStorage
  const getCurrentUser = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("current_user");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log("Error:", e);
    }
  };

  const refreshUser = async (user) => {
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
      console.log("Error in App.js: ", e);
    }

    const docRef = doc(firestore, "users", user.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      //Nutzerdokument existiert -> Nutzer-State mit Daten füllen
      setUser({
        username: docSnap.data().username,
        id: docSnap.data().id,
        email: docSnap.data().email,
        photoUrl: docSnap.data().photoUrl,
        friends: docSnap.data().friends,
        requests: docSnap.data().requests,
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
      });
    } else {
      //Nutzer-Dokument existiert nicht -> loggt sich erstmalig ein -> Dokument erstellen
      try {
        await setDoc(doc(firestore, "users", user.id), {
          username: user.name,
          id: user.id,
          email: user.email,
          photoUrl: user.photoUrl,
          friends: [],
          requests: [],
          username_array: createUsernameArray(user.name),
          joint_counter: 0,
          bong_counter: 0,
          vape_counter: 0,
          pipe_counter: 0,
          cookie_counter: 0,
          last_entry_timestamp: null,
          last_entry_latitude: null,
          last_entry_longitude: null,
          last_entry_type: null,
          last_feedback: null,
          member_since: new Date().toISOString().slice(0, 10),
          main_counter: 0,
        });
        const docSnap = await getDoc(doc(firestore, "users", user.id));
        if (docSnap.exists()) {
          setUser({
            username: docSnap.data().username,
            id: docSnap.data().id,
            email: docSnap.data().email,
            photoUrl: docSnap.data().photoUrl,
            friends: docSnap.data().friends,
            requests: docSnap.data().requests,
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
          });
        }
      } catch (e) {
        console.log("Error:", e);
      }

      //Einstellungs-Objekt im Local Storage erstmalig einrichten:
      /* try {
        const value = JSON.stringify({
          showJoint: true,
          showBong: true,
          showVape: true,
          showPipe: true,
          showCookie: true,
          shareMainCounter: false,
          shareTypeCounters: false,
          shareLastEntry: false,
          saveGPS: false,
          shareGPS: false,
          localAuthenticationRequired: false,
          language: "en",
          first: true
        });
        await AsyncStorage.setItem("settings", value);
      } catch (e) {
        console.log("Error in App.js: ", e);
      } */

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
        console.log("Error in App.js: ", e);
      }
    }
  };

 const handleLogin = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId:
          "31827165734-rdbihglcac1juesc6fkjd4bgp1c1oj2s.apps.googleusercontent.com",
        iosClientId:
          "31827165734-cjrhm51isdg9bjjfji9h2ike188n9d6j.apps.googleusercontent.com",  
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        try {
          await refreshUser(result.user);
          console.log("login");
          try {
            const jsonValue = JSON.stringify(result.user);
            await AsyncStorage.setItem("current_user", jsonValue);
          } catch (e) {
            console.log("Error:", e);
          }
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
  }

  const handleIntroFinish = async () => {
    //Hier FALSE setzen, wenn Intro fertig gebaut ist.
    await AsyncStorage.setItem("settings", JSON.stringify({...config, first: false}));
    loadSettings();
  }

  const [loaded] = useFonts({
    PoppinsBlack: require("./assets/fonts/Poppins-Bold.ttf"),
    PoppinsMedium: require("./assets/fonts/Poppins-Medium.ttf"),
    PoppinsLight: require("./assets/fonts/Poppins-Light.ttf"),
  })

  const toggleLanguage = async ( lang ) => {
    console.log(lang, config.language);
    if (lang == "de" && config.language == "en") {
      setLanguage(Languages.de);
      await AsyncStorage.setItem("settings",JSON.stringify({...config, language: "de"}));
      setConfig({...config, language: "de"});
      console.debug(lang);
    }
    if (lang == "en" && config.language == "de") {
      setLanguage(Languages.en);
      await AsyncStorage.setItem("settings",JSON.stringify({...config, language: "en"}));
      setConfig({...config, language: "en"});
      console.debug(lang);
    } 
  }

  const handleAuthenticatorSelect = async ( bool ) => {
      await AsyncStorage.setItem("settings", JSON.stringify({...config, localAuthenticationRequired: bool}));

  }

  const handleLogOut = async () => {
    try {
      await Google.logOutAsync({
        androidClientId:
          "31827165734-rdbihglcac1juesc6fkjd4bgp1c1oj2s.apps.googleusercontent.com",
        iosClientId:
          "31827165734-cjrhm51isdg9bjjfji9h2ike188n9d6j.apps.googleusercontent.com",
        scopes: ["profile", "email"], 
      });
    } catch (e) {
      console.log("Error:", e);
    }
    setUser(null);
  };

  //Überarbeiten -> dauert noch zu lang (zu viele if statements)
  const toggleCounter = async (index) => {
    let settings = {};
    let new_entry = {};
    try {
      const jsonValue = await AsyncStorage.getItem("settings");
      jsonValue != null ? (settings = JSON.parse(jsonValue)) : null;
    } catch (e) {
      console.log("Error in App.js: ", e);
    }

    Platform.OS === "android" ? Vibration.vibrate(50) : null;

    // Neuen Index für Zitat ermitteln
    setSayingNr(Math.floor(Math.random() * sayings.length));

    setModalVisible(true);

    if (settings.saveGPS) {
      // Die Bestimmung der Position dauert von den Schritten in der Funktion toggleCounter() mit Abstand am längsten
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      new_entry = {
        number: user.main_counter + 1,
        type: index,
        timestamp: Date.now(),
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } else {
      new_entry = {
        number: user.main_counter + 1,
        type: index,
        timestamp: Date.now(),
        latitude: null,
        longitude: null,
      };
    }

    await writeLocalStorage(new_entry);

    const docRef = doc(firestore, "users", user.id);
    const docSnap = await getDoc(docRef);

    if (settings.shareMainCounter) {
      await updateDoc(docRef, {
        main_counter: user.main_counter + 1,
      });
    } else {
      await updateDoc(docRef, {
        main_counter: null,
      });
    }

    if (settings.shareTypeCounters && settings.shareMainCounter) {
      await updateDoc(docRef, {
        joint_counter: user.joint_counter,
        bong_counter: user.bong_counter,
        vape_counter: user.vape_counter,
        pipe_counter: user.pipe_counter,
        cookie_counter: user.cookie_counter,
        [index + "_counter"]: user[index + "_counter"] + 1,
      });
    } else {
      await updateDoc(docRef, {
        joint_counter: null,
        bong_counter: null,
        vape_counter: null,
        pipe_counter: null,
        cookie_counter: null,
      });
    }

    if (settings.shareLastEntry) {
      await updateDoc(docRef, {
        last_entry_timestamp: new_entry.timestamp,
        last_entry_type: new_entry.type,
      });
    } else {
      await updateDoc(docRef, {
        last_entry_timestamp: null,
        last_entry_type: null,
      });
    }

    if (settings.shareGPS) {
      await updateDoc(docRef, {
        last_entry_latitude: new_entry.latitude,
        last_entry_longitude: new_entry.longitude,
      });
    } else {
      await updateDoc(docRef, {
        last_entry_latitude: null,
        last_entry_longitude: null,
      });
    }

    let local_counters = {};

    try {
      const jsonValue = await AsyncStorage.getItem(user.id + "_counters");
      jsonValue != null ? (local_counters = JSON.parse(jsonValue)) : null;
    } catch (e) {
      console.log("Error in App.js: ", e);
    }

    // Das sollte in Zukunft noch ersetzt werden
    const docSnap_new = await getDoc(docRef);
    setUser({
      ...user,
      main_counter: local_counters.main,
      joint_counter: local_counters.joint,
      bong_counter: local_counters.bong,
      vape_counter: local_counters.vape,
      pipe_counter: local_counters.pipe,
      cookie_counter: local_counters.cookie,
      last_entry_timestamp: docSnap_new.data().last_entry_timestamp,
      last_entry_type: docSnap_new.data().last_entry_type,
      last_entry_latitude: docSnap_new.data().last_entry_latitude,
      last_entry_longitude: docSnap_new.data().last_entry_longitude,
    });

    setWriteComplete(true);
  };

  const createUsernameArray = (name) => {
    let name_array = [];
    for (let i = 1; i <= name.length; i++) {
      name_array.push(name.slice(0, i));
    }
    return name_array;
  };

  const writeLocalStorage = async (new_entry) => {
    // Erstellt neuen Eintrag im AsyncStorage
    try {
      const jsonValue = JSON.stringify(new_entry);
      await AsyncStorage.setItem(
        user.id + "_entry_" + (user.main_counter + 1),
        jsonValue
      );
    } catch (e) {
      console.log("Error:", e);
    }

    // Updated betroffene Counters im AsyncStorage
    let current_counters = {};

    try {
      const jsonValue = await AsyncStorage.getItem(user.id + "_counters");
      jsonValue != null ? (current_counters = JSON.parse(jsonValue)) : null;
    } catch (e) {
      console.log("Error in App.js: ", e);
    }

    current_counters[new_entry.type] += 1;
    current_counters.main += 1;

    try {
      const jsonValue = JSON.stringify(current_counters);
      await AsyncStorage.setItem(user.id + "_counters", jsonValue);
    } catch (e) {
      console.log("Error:", e);
    }
  };

  const deleteAccount = async () => {
    setLoading(true);
     handleLogOut();

    // Firestore-Doc löschen
    const docRef = doc(firestore, "users", user.id);
    await deleteDoc(docRef);
    
    // AsyncStorage-Daten löschen
    try {
      await AsyncStorage.clear();
      setConfig({
        showJoint: true,
        showBong: true,
        showVape: true,
        showPipe: true,
        showCookie: true,
        shareMainCounter: false,
        shareTypeCounters: false,
        shareLastEntry: false,
        saveGPS: false,
        shareGPS: false,
        localAuthenticationRequired: false,
        language: "en",
        first: true
      });
    } catch (e) {
      console.log("Fehler beim Löschen des AsyncStorage.", e);
    }
    setLoading(false);
  };

  const getFriendList = async () => {
    if (user != null) {
      const docRef = doc(firestore, "users", user.id);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
          setFriendList(docSnap.data().friends);
      }
      setLoading(false);
    }
  }

  return (
    <>
      <View style={{flex: 1, backgroundColor: "#1E2132"}}>
      <ConfigContext.Provider value={config}>
      <LanguageContext.Provider value={language}>

      <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
            setWriteComplete(false);
          }}
      >
        <CounterModal loadingColor={loadingColor} onExit={() => {setModalVisible(!modalVisible); setWriteComplete(false); StatusBar.setBackgroundColor("rgba(0,0,0,0)");}} writeComplete={writeComplete} sayingNr={sayingNr}/>    
      </Modal>


        { showSplash ? 
        <Splash onExit={() => {setShowSplash(false);}}/>
        : 
        <>
          {loading ? <View style={{justifyContent: "center", height: "100%"}}><CustomLoader color={"white"} x={80}/></View>
          :
          <>
            
            {config.localAuthenticationRequired && !unlocked ? <Authenticator first={false} onSubmit={() => setUnlocked(true)} onCancel={() => setUnlocked(false)} onExit={() => null}/>
            :
            <>
              {config.first ? <Intro 
                                onExit={() => handleIntroFinish()}
                                onLanguageSelect={(lang) => toggleLanguage(lang)}
                                onAuthenticatorSelect={(bool) => handleAuthenticatorSelect(bool)}/>
              :
              <>
                {user ? <UserContext.Provider value={user}>
                          <FriendListContext.Provider value={friendList}>
                            <Home
                              handleLogOut={handleLogOut}
                              toggleCounter={toggleCounter}
                              toggleLanguage={toggleLanguage}
                              deleteAccount={deleteAccount}
                              getFriendList={getFriendList}
                              loadSettings={loadSettings}
                              />
                          </FriendListContext.Provider>
                        </UserContext.Provider>
                :
                <Login handleLogin={handleLogin} />
                }
              </>}
            </>}
            </>}
        </>}
        </LanguageContext.Provider>
        </ConfigContext.Provider>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E2132",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#1E2132",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 20,
  },
  modalBigText: {
    textAlign: "center",
    color: "white",
    fontFamily: "PoppinsBlack",
    fontSize: 45,
    paddingBottom: 20,
  },
  modalSmallText: {
    textAlign: "center",
    color: "white",
    fontFamily: "PoppinsLight",
    fontSize: 18,
    marginBottom: 30,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontFamily: "PoppinsBlack",
    fontSize: 30,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  heading: {
    color: "white",
    fontSize: 20,
    fontFamily: "PoppinsBlack",
    marginLeft: 20,
  },
  text: {
    alignSelf: "center",
    fontFamily: "PoppinsLight",
    fontSize: 18,
    color: "white",
    maxWidth: 250,
    textAlign: "center",
  },
});
