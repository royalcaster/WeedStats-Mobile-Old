//React
import React from "react";
import { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Platform,
  Text,
  View,
  Modal,
  Vibration,
  Dimensions,
  StatusBar
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { LogBox } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "./src/components/common/Button";

//Custom Components
import Home from "./src/components/Home/Home";
import Login from "./src/components/Login/Login";
import sayings from "./src/data/Sayings.json";
import Splash from "./src/components/Splash/Splash";
import CustomLoader from "./src/components/common/CustomLoader";
import Authenticator from "./src/components/common/Authenticator";

//Firebase
import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "./src/data/FirebaseConfig";
import { AppRegistry } from "react-native";

//Expo
import { useFonts } from "expo-font";
import * as Google from "expo-google-app-auth";
import * as Location from "expo-location";
import * as LocalAuthentication from 'expo-local-authentication'

//Service
import { UserContext } from "./src/data/UserContext";
import { LanguageContext } from "./src/data/LanguageContext";
import Languages from './src/data/languages.json'


try {
  LogBox.ignoreLogs(["Setting a timer for a long period of time"]);
} catch (e) {
  console.log("Error", e);
}

AppRegistry.registerComponent("main", () => App);

export default function App() {

  const [user, setUser] = useState(null);
  const [config, setConfig] = useState(null);
  const [language, setLanguage] = useState(Languages.de);
  const [userLoaded, setUserLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [writeComplete, setWriteComplete] = useState(false);
  const [sayingNr, setSayingNr] = useState(0);
  const screen_height = Dimensions.get('screen').height;
  const [showSplash, setShowSplash] = useState(true);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [localAuthenticationRequired, setLocalAuthenticationRequired] = useState(false);

  //Local Authentication
  const [localAuthenticated, setLocalAuthenticated] = useState(false);

  //Schreibt Einstellungen in den Async Storage
  const storeSettings = async () => {
    try {
      const jsonValue = JSON.stringify(config);
      await AsyncStorage.setItem("settings", jsonValue);
    } catch (e) {
      console.log("Error in Config beim Speichern: ", e);
    }
  };

  //Holt Einstellungen aus dem AsyncStorage
  const loadSettings = async () => {
    setSettingsLoaded(false);
    try {
      const jsonValue = await AsyncStorage.getItem("settings");
      jsonValue != null ? setConfig(JSON.parse(jsonValue)) : null;
      setLocalAuthenticationRequired(JSON.parse(jsonValue).localAuthenticationRequired);
    } catch (e) {
      console.log("Error in Config beim Laden: ", e);
    }
    setSettingsLoaded(true);
  };

  useEffect(() => {
    loadSettings();
    checkForUser();
    loadSettings();
  }, []);

  //Sucht im AsyncStorage nach dem letzten User der sich eingeloggt hat und loggt sich bei Erfolg automatisch ein
  const checkForUser = async () => {
    if (!userLoaded) {
      const current_user = await getCurrentUser();
      current_user != null ? refreshUser(current_user) : null;
      setUserLoaded(true);
    }
  }

  //Schriftarten Laden
  const [test] = useFonts({
    PoppinsBlack: require("./src/fonts/Poppins-Black.ttf"),
    PoppinsMedium: require("./src/fonts/Poppins-Medium.ttf"),
    PoppinsLight: require("./src/fonts/Poppins-Light.ttf"),
  });

  const toggleLanguage = ( lang ) => {
    if (lang == "de" && config.language == "en") {
      setLanguage(Languages.de);
    }
    if (lang == "en" && config.language == "de") {
      setLanguage(Languages.en);
    } 
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

  const createUsernameArray = (name) => {
    let name_array = [];
    for (let i = 1; i <= name.length; i++) {
      name_array.push(name.slice(0, i));
    }
    return name_array;
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
      try {
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
          localAuthenticationRequired: true,
          first: true
        });
        await AsyncStorage.setItem("settings", value);
      } catch (e) {
        console.log("Error in App.js: ", e);
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
        console.log("Error in App.js: ", e);
      }
    }
  };

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

  const [loaded] = useFonts({
    PoppinsBlack: require("./assets/fonts/Poppins-Black.ttf"),
    PoppinsLight: require("./assets/fonts/Poppins-Light.ttf"),
  });

  if (!loaded) {
    return null;
  }

  const handleCancel = () => {
    disableLocalAuthentication();
    storeSettings();
    loadSettings();
    setLocalAuthenticated(false);
    console.debug(config.localAuthenticationRequired);
  }

  return (
    <>
      <NavigationContainer>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
            setWriteComplete(false);
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
              flex: 1,
              height: screen_height
            }}
          >
            <View
                style={{
                  width: "90%",
                  height: 300,
                  backgroundColor: "#1E2132",
                  alignSelf: "center",
                  borderRadius: 25,
                }}
              >
            {writeComplete ? (
              <>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.heading,
                      {
                        marginLeft: 0,
                        textAlign: "center",
                        height: "100%",
                        textAlignVertical: "center",
                        fontSize: 22,
                      },
                    ]}
                  >
                    {language.success}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.text, { fontSize: 15 }]}>
                    {language.sayings[sayingNr].saying}
                  </Text>
                  <Text
                    style={[
                      styles.text,
                      { fontSize: 15, fontStyle: "italic", marginTop: 10 },
                    ]}
                  >
                    {language.sayings[sayingNr].from}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    title={"Ok"}
                    color={"#0080FF"}
                    borderradius={25}
                    fontColor={"white"}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                      setWriteComplete(false);
                    }}
                    hovercolor={"rgba(255,255,255,0.3)"}
                  />
                </View></>
              
            ) : (
              <View style={{height: "100%", width: "100%", justifyContent: "center"}}>
              <CustomLoader x={50} color={"#0080FF"}/></View>
            )}
            </View>
          </View>
        </Modal>

        <View style={{ flex: 1, backgroundColor: "#1E2132" }}>
          {showSplash ? <Splash onExit={() => {setShowSplash(false);}}/> 
          : <>
              {localAuthenticated || !config.localAuthenticationRequired ? <>
                {user ? (
                  <UserContext.Provider value={user}>
                    <LanguageContext.Provider value={language}>
                      <Home
                        handleLogOut={handleLogOut}
                        toggleCounter={toggleCounter}
                        toggleLanguage={toggleLanguage}
                      />
                    </LanguageContext.Provider>
                  </UserContext.Provider>
                ) : (
                  <Login handleLogin={handleLogin} />
                )}</> : 
                  <Authenticator 
                    first={config.first} 
                    onSubmit={() => setLocalAuthenticated(true)} 
                    onCancel={() => {handleCancel()}}/>
                }
              </>
            }
        </View>
      </NavigationContainer>
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
