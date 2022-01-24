//React
import React from "react";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Platform,
  ActivityIndicator,
  Text,
  View,
  Modal,
  Pressable,
  Vibration,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { LogBox } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Components
import Home from "./src/components/Home";
import Login from "./src/components/Login";
import getRandomSaying from "./src/Sayings";
import Splash from "./src/components/Splash";

//Firebase
import { setDoc, doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db, firestore } from "./src/components/FirebaseConfig";

//Expo
import { useFonts } from "expo-font";
import * as Google from "expo-google-app-auth";
import * as Location from "expo-location";

try {
  LogBox.ignoreLogs(["Setting a timer for a long period of time"]);
} catch (e) {
  console.log("Error", e);
}

export default function App() {
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [statConfig, setStatConfig] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [writeComplete, setWriteComplete] = useState(false);

  const [showSplash, setShowSplash] = useState(true);

  /* useEffect(() => {
    fadeSplash();
    setTimeout(() => hideSplash(),3000);
  },[]); */

  

  //Sucht im AsyncStorage nach dem letzten User der sich eingeloggt hat und loggt sich bei Erfolg automatisch ein
  useEffect(async () => {
    if (!userLoaded) {
      const current_user = await getCurrentUser();
      current_user != null ? refreshUser(current_user) : null;
      setUserLoaded(true);
    }
  }, []);

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
        joint_counter: docSnap.data().joint_counter,
        bong_counter: docSnap.data().bong_counter,
        vape_counter: docSnap.data().vape_counter,
        member_since: docSnap.data().member_since,
        last_entry_timestamp: docSnap.data().last_entry_timestamp,
        last_entry_latitude: docSnap.data().last_entry_latitude,
        last_entry_longitude: docSnap.data().last_entry_longitude,
        last_entry_type: docSnap.data().last_entry_type,
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
      //Nutzer-Dokument existiert nicht -> loggt sich erstmalig ein -> Dokument erstellen
      try {
        await setDoc(doc(firestore, "users", user.id), {
          username: user.name,
          id: user.id,
          email: user.email,
          photoUrl: user.photoUrl,
          friends: [],
          joint_counter: 0,
          bong_counter: 0,
          vape_counter: 0,
          last_entry_timestamp: null,
          last_entry_latitude: null,
          last_entry_longitude: null,
          last_entry_type: null,
          show_joint: true,
          show_bong: true,
          show_vape: true,
          member_since: new Date().toISOString().slice(0, 10),
          main_counter: 0,
        });
        console.log(user.photoUrl);
        const docSnap = await getDoc(doc(firestore, "users", user.id));
        if (docSnap.exists()) {
          setUser({
            username: docSnap.data().username,
            id: docSnap.data().id,
            email: docSnap.data().email,
            photoUrl: docSnap.data().photoUrl,
            friends: docSnap.data().friends,
            joint_counter: docSnap.data().joint_counter,
            bong_counter: docSnap.data().bong_counter,
            vape_counter: docSnap.data().vape_counter,
            member_since: docSnap.data().member_since,
            last_entry_timestamp: docSnap.data().last_entry_timestamp,
            last_entry_latitude: docSnap.data().last_entry_latitude,
            last_entry_longitude: docSnap.data().last_entry_longitude,
            last_entry_type: docSnap.data().last_entry_type,
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

  /* const writeDb = async (type) => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    const userListRef = ref(db, "users/" + user.id);
    const newEntryRef = push(userListRef, {
      number: user.main_counter + 1,
      type: type,
      timestamp: Date.now(),
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    return newEntryRef;
  }; */

  const writeLocalStorage = async (new_entry) => {
    try {
      const jsonValue = JSON.stringify(new_entry);
      await AsyncStorage.setItem(
        user.id + "_entry_" + (user.main_counter + 1),
        jsonValue
      );
    } catch (e) {
      console.log("Error:", e);
    }
  };

  // Zum Löschen einzelner Daten aus der History. Erstmal entfernt, da die Konsistenz der Daten nach aktuellem Stand darunter leidet
  /* const deleteEntryGlobally = async (type_del, lastEntry = null) => {
    const docRef = doc(firestore, "users", user.id);
    const docSnap = await getDoc(docRef);

    await updateDoc(docRef, {
      main_counter: docSnap.data().main_counter - 1,
    });

    if (lastEntry) {
      await updateDoc(docRef, {
        last_entry_timestamp: lastEntry.timestamp,
        last_entry_type: lastEntry.type,
        last_entry_latitude: lastEntry.latitude,
        last_entry_longitude: lastEntry.longitude,
      });
    }

    switch (type_del) {
      case "joint":
        await updateDoc(docRef, {
          joint_counter: docSnap.data().joint_counter - 1,
        });
        break;
      case "bong":
        await updateDoc(docRef, {
          bong_counter: docSnap.data().bong_counter - 1,
        });
        break;
      case "vape":
        await updateDoc(docRef, {
          vape_counter: docSnap.data().vape_counter - 1,
        });
        break;
    }

    const new_docSnap = await getDoc(docRef);

    setUser({
      ...user,
      joint_counter: new_docSnap.data().joint_counter,
      bong_counter: new_docSnap.data().bong_counter,
      vape_counter: new_docSnap.data().vape_counter,
      last_entry_timestamp: new_docSnap.data().last_entry_timestamp,
      last_entry_latitude: new_docSnap.data().last_entry_latitude,
      last_entry_longitude: new_docSnap.data().last_entry_longitude,
      last_entry_type: new_docSnap.data().last_entry_type,
      main_counter: new_docSnap.data().main_counter,
    });
  };
 */

  const toggleCounter = async (index) => {
    Platform.OS === "android" ? Vibration.vibrate(50) : null;

    setModalVisible(true);

    // Die Bestimmung der Position dauert von den Schritten in der Funktion toggleCounter() mit Abstand am längsten
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    const new_entry = {
      number: user.main_counter + 1,
      type: index,
      timestamp: Date.now(),
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    await writeLocalStorage(new_entry);

    const docRef = doc(firestore, "users", user.id);
    const docSnap = await getDoc(docRef);

    await updateDoc(docRef, {
      main_counter: docSnap.data().main_counter + 1,
      last_entry_timestamp: new_entry.timestamp,
      last_entry_type: new_entry.type,
      last_entry_latitude: new_entry.latitude,
      last_entry_longitude: new_entry.longitude,
    });

    switch (index) {
      case "joint":
        await updateDoc(docRef, {
          joint_counter: docSnap.data().joint_counter + 1,
        });
        break;
      case "bong":
        await updateDoc(docRef, {
          bong_counter: docSnap.data().bong_counter + 1,
        });
        break;
      case "vape":
        await updateDoc(docRef, {
          vape_counter: docSnap.data().vape_counter + 1,
        });
        break;
    }

    const docSnap_new = await getDoc(docRef);
    setUser({
      ...user,
      main_counter: docSnap_new.data().main_counter,
      joint_counter: docSnap_new.data().joint_counter,
      bong_counter: docSnap_new.data().bong_counter,
      vape_counter: docSnap_new.data().vape_counter,
      last_entry_timestamp: docSnap_new.data().last_entry_timestamp,
      last_entry_type: docSnap_new.data().last_entry_type,
      last_entry_latitude: docSnap_new.data().last_entry_latitude,
      last_entry_longitude: docSnap_new.data().last_entry_longitude,
    });

    setWriteComplete(true);
  };

  const toggleConfig = async (index) => {
    const docRef = doc(firestore, "users", user.id);
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
    PoppinsLight: require("./assets/fonts/Poppins-Light.ttf"),
  });

  if (!loaded) {
    return null;
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
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {writeComplete ? (
                <>
                  <Text style={styles.modalBigText}>Erfolg!</Text>
                  <Text style={styles.modalSmallText}>{getRandomSaying()}</Text>
                  <Pressable
                    style={({ pressed }) => [
                      { backgroundColor: pressed ? "#2b2b2b" : "#383838" },
                      styles.button,
                    ]}
                    hitSlop={50}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                      setWriteComplete(false);
                    }}
                  >
                    <Text style={styles.buttonText}>OK</Text>
                  </Pressable>
                </>
              ) : (
                <ActivityIndicator
                  animating={true}
                  size="large"
                  color="#0080FF"
                />
              )}
            </View>
          </View>
      </Modal>
      <View style={{flex: 1, backgroundColor: "#171717"}}>
        {showSplash ? <Splash onExit={() => setShowSplash(false)}/> : null}

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
      </View>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    borderWidth: 5,
    borderColor: "white",
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
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
});
