import React, { useState, useEffect } from "react";
import { useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  Pressable,
  Animated,
  Easing,
  Dimensions,
  TouchableNativeFeedback,
  Modal,
  BackHandler,
} from "react-native";

import Feedback from "./Feedback";
import Donation from "./Donation";
import Levels from "./Levels";

import AsyncStorage from "@react-native-async-storage/async-storage";

import Swipeable from "react-native-gesture-handler/Swipeable";

import { useFonts } from "expo-font";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Antdesign from "react-native-vector-icons/AntDesign";

import ProfileImage from "./ProfileImage";

import Entypo from "react-native-vector-icons/Entypo";

import { useBackHandler } from "@react-native-community/hooks";

//Firebase
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "./FirebaseConfig";

import Button from "./Button";
import BackButton from "./BackButton";

const Account = ({ user, handleLogOut, onexit, show }) => {
  const screen_height = Dimensions.get("screen").height;

  const [showLevels, setShowLevels] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const opacityAnim = useRef(new Animated.Value(screen_height)).current;

  const [loaded] = useFonts({
    PoppinsBlack: require("./fonts/Poppins-Black.ttf"),
    PoppinsLight: require("./fonts/Poppins-Light.ttf"),
  });

  const slide = () => {
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 600,
      easing: Easing.bezier(0.2, 1, 0.21, 0.97),
      useNativeDriver: true,
    }).start();
  };

  const hide = () => {
    Animated.timing(opacityAnim, {
      toValue: screen_height,
      duration: 1200,
      easing: Easing.bezier(0, 1.02, 0.21, 0.97),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        /* onexit(); */
      }
    });
  };

  show ? slide() : hide();

  useBackHandler(() => {
    onexit();
    hide();
    return true;
  });

  const deleteAccount = async () => {
    handleLogOut();

    // Firestore-Doc löschen
    const docRef = doc(firestore, "users", user.id);
    await deleteDoc(docRef);

    // AsyncStorage-Daten löschen
    let allKeys = [];
    try {
      allKeys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(allKeys);
    } catch (e) {
      console.log("Fehler beim Löschen des AsyncStorage.", e);
    }
  };

  // Diese Funktion darf nach Bedarf mit neuer Funktionalität gefüllt werden und dient z.B. dazu, veraltete Einträge im AsyncStorage zu entfernen.
  // In der finalen Version der App fliegt diese Funktion natürlich raus.
  const doWhatever = async () => {
    const docRef = doc(firestore, "users", user.id);
    const docSnap = await getDoc(docRef);

    try {
      const value = JSON.stringify({
        showJoint: true,
        showBong: true,
        showVape: true,
        showPipe: true,
        showCookie: true,
        shareMainCounter: true,
        shareTypeCounters: true,
        shareLastEntry: true,
        saveGPS: true,
        shareGPS: true,
        showTutorial: true,
      });
      await AsyncStorage.setItem("settings", value);
    } catch (e) {
      console.log("Error in App.js: ", e);
    }
    try {
      const value = JSON.stringify({
        main: docSnap.data().main_counter,
        joint: docSnap.data().joint_counter,
        bong: docSnap.data().bong_counter,
        vape: docSnap.data().vape_counter,
        pipe: docSnap.data().pipe_counter,
        cookie: docSnap.data().cookie_counter,
      });
      await AsyncStorage.setItem(user.id + "_counters", value);
    } catch (e) {
      console.log("Error in App.js: ", e);
    }
  };

  const [showDelete, setShowDelete] = useState(false);

  return (
    <Animated.View
      style={[
        {
          opacity: 1,
          height: "100%",
          transform: [{ translateY: opacityAnim }],
        },
        styles.container,
      ]}
    >
      {showLevels ? <Levels onexit={() => setShowLevels(false)} /> : null}
      {showFeedback ? (
        <Feedback userid={user.id} onexit={() => setShowFeedback(false)} />
      ) : null}
      {showDonation ? <Donation onexit={() => setShowDonation(false)} /> : null}

      <Modal animationType="fade" transparent={true} visible={showDelete}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
            flex: 1,
          }}
        >
          <View
            style={{
              width: "90%",
              height: 300,
              backgroundColor: "#171717",
              alignSelf: "center",
              borderRadius: 25,
            }}
          >
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
                Achtung
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.text, { fontSize: 15 }]}>
                Das kann nicht rückgängig gemacht werden. Dieses Konto wirklich
                löschen?
              </Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableNativeFeedback
                  background={TouchableNativeFeedback.Ripple(
                    "rgba(255,255,255,0.05)",
                    true
                  )}
                  onPress={() => setShowDelete(false)}
                >
                  <View style={styles.touchable}>
                    <Antdesign
                      name="close"
                      style={[styles.icon, { color: "#eb4034" }]}
                    />
                  </View>
                </TouchableNativeFeedback>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableNativeFeedback
                  background={TouchableNativeFeedback.Ripple(
                    "rgba(255,255,255,0.05)",
                    true
                  )}
                  onPress={() => deleteAccount()}
                >
                  <View style={styles.touchable}>
                    <Antdesign
                      name="check"
                      style={[styles.icon, { color: "#3BA426" }]}
                    />
                  </View>
                </TouchableNativeFeedback>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ height: 50 }}></View>

      <View
        style={{
          flex: 1,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          backgroundColor: "#0F0F0F",
        }}
      >
        <View style={{ width: "100%", height: 60, justifyContent: "center" }}>
          <View style={{ marginLeft: 5, position: "absolute" }}>
            <View style={{ transform: [{ rotate: "-90deg" }] }}>
              <BackButton
                onPress={() => {
                  onexit();
                  hide();
                }}
              />
            </View>
          </View>
          <Text
            style={{
              alignSelf: "center",
              color: "rgba(255,255,255,0.5)",
              fontSize: 13,
              fontFamily: "PoppinsLight",
              letterSpacing: 2,
            }}
          >
            DEIN ACCOUNT
          </Text>
        </View>

        <View
          style={{
            alignItems: "center",
            flex: 2,
            flexDirection: "row",
            width: "100%",
            alignSelf: "center",
            paddingRight: 20,
            paddingLeft: 20,
            height: 100,
          }}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ProfileImage url={user.photoUrl} x={70} type={1} />
          </View>

          <View style={{ flex: 2 }}>
            <Text style={styles.username}>{user.username}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              alignSelf: "center",
              color: "rgba(255,255,255,0.75)",
              fontSize: 15,
              fontFamily: "PoppinsLight",
              letterSpacing: 2,
            }}
          >
            MITGLED SEIT: {user.member_since}
          </Text>
        </View>
        <Button
          fontColor={"white"}
          onPress={doWhatever}
          borderradius={100}
          color={"#1E1E1E"}
          title={"Bugfix!"}
          icon={<FontAwesome name="gears" style={styles.money_icon} />}
        />

        <View style={{ height: 15 }}></View>

        <Button
          fontColor={"white"}
          onPress={() => setShowLevels(true)}
          borderradius={100}
          color={"#1E1E1E"}
          title={" Levelübersicht"}
          icon={<FontAwesome name="trophy" style={styles.money_icon} />}
        />

        <View style={{ height: 15 }}></View>

        <Button
          onPress={() => setShowFeedback(true)}
          title={" Feedback senden"}
          icon={<FontAwesome name="gears" style={styles.money_icon} />}
          borderradius={100}
          color={"#1E1E1E"}
          fontColor={"white"}
        />

        <View style={{ height: 15 }}></View>

        <Button
          onPress={() => setShowDonation(true)}
          title={"WeedStats unterstützen"}
          icon={<MaterialIcons name="euro" style={styles.money_icon} />}
          borderradius={100}
          color={"#1E1E1E"}
          fontColor={"white"}
        />

        <View style={{ height: 15 }}></View>

        <Button
          onPress={handleLogOut}
          title={"Abmelden"}
          icon={<MaterialIcons name="logout" style={styles.money_icon} />}
          borderradius={100}
          color={"#eb4034"}
          fontColor={"white"}
        />

        <View style={{ height: 10 }}></View>

        <View style={{ width: "100%" }}>
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(
              "rgba(255,255,255,0.05)",
              false
            )}
            onPress={() => setShowDelete(true)}
          >
            <View style={styles.touchable_delete}>
              <Text style={styles.delete_text}>Dieses Konto löschen</Text>
            </View>
          </TouchableNativeFeedback>
        </View>

        <View style={{ height: 10 }}></View>
      </View>
    </Animated.View>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    zIndex: 1,
    position: "absolute",
    backgroundColor: "#171717",
    alignSelf: "center",
  },
  profile_img: {
    height: 120,
    width: 120,
  },
  username: {
    color: "white",
    fontSize: 18,
    fontFamily: "PoppinsBlack",
  },
  email: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    fontFamily: "PoppinsLight",
  },
  signOutButton: {
    width: "80%",
    alignSelf: "center",
    height: 50,
    borderRadius: 100,
    justifyContent: "center",
    marginTop: 20,
    bottom: 20,
    flexDirection: "row",
  },
  money_icon: {
    fontSize: 25,
    color: "white",
    textAlignVertical: "center",
  },
  pressable_back: {
    width: 80,
    padding: 10,
    borderRadius: 25,
    marginLeft: 10,
  },
  icon_back: {
    color: "white",
    fontSize: 30,
    left: 5,
  },
  member_text: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 16,
    fontFamily: "PoppinsLight",
  },
  button_text: {
    color: "white",
    fontSize: 18,
    fontFamily: "PoppinsLight",
    textAlign: "center",
    top: 2,
    textAlignVertical: "center",
  },
  touchable_delete: {
    width: "100%",
    alignSelf: "center",
    height: 60,
    borderRadius: 100,
  },
  delete_text: {
    color: "#eb4034",
    fontFamily: "PoppinsLight",
    alignSelf: "center",
    textAlignVertical: "center",
    height: "100%",
  },
  modal_container: {
    backgroundColor: "#1E1E1E",
    width: "90%",
    height: 300,
    alignSelf: "center",
    borderRadius: 25,
    flexDirection: "column",
  },
  heading: {
    color: "white",
    textAlign: "center",
    fontFamily: "PoppinsBlack",
    fontSize: 22,
    maxWidth: 300,
    alignSelf: "center",
  },
  touchable: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 40,
  },
  info_icon: {
    color: "white",
    fontSize: 30,
    textAlign: "center",
    marginTop: 20,
  },
  text: {
    color: "white",
    fontFamily: "PoppinsLight",
    textAlign: "center",
    maxWidth: 300,
    alignSelf: "center",
  },
});
