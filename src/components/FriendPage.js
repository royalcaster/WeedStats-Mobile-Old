import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  ScrollView,
  TouchableNativeFeedback,
  Modal,
  BackHandler,
} from "react-native";

import Antdesign from "react-native-vector-icons/AntDesign";

//Firebase
import { setDoc, doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db, firestore } from "./FirebaseConfig";

import BackButton from "./BackButton";

import levels from "../Levels.json";

import { LinearGradient } from "expo-linear-gradient";

const FriendPage = ({ show, userid, onExit, realuser, refresh }) => {
    
  const screen_width = Dimensions.get("screen").width;

  const [user, setUser] = useState();

  const [modalVisible, setModalVisible] = useState(false);

  const slideAnim = useRef(new Animated.Value(screen_width)).current;

  useEffect(() => {
    if (userid) {
      getUser();
    }
  }, [userid]);

  const getUser = async () => {
    try {
      const docRef = doc(firestore, "users", userid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUser({
          username: docSnap.data().username,
          photoUrl: chopUrl(docSnap.data().photoUrl),
          member_since: docSnap.data().member_since,
          main_counter: docSnap.data().main_counter,
          last_act_timestamp: docSnap.data().last_entry_timestamp,
          last_act_type: docSnap.data().last_entry_type,
        });
      }
    } catch (e) {
      console.log("Error", e);
    }
  };

  const slide = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 700,
      useNativeDriver: true,
      easing: Easing.bezier(0, 1.02, 0.21, 0.97),
    }).start();
  };

  // Call back function when back button is pressed
  const backActionHandler = () => {
    hide();
    return true;
  };

  useEffect(() => {
    // Add event listener for hardware back button press on Android
    BackHandler.addEventListener("hardwareBackPress", backActionHandler);

    return () =>
      // clear/remove event listener
      BackHandler.removeEventListener("hardwareBackPress", backActionHandler);
  }, []);

  const hide = () => {
    Animated.timing(slideAnim, {
      toValue: screen_width,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.bezier(0, 1.02, 0.21, 0.97),
    }).start(({ finished }) => {
      if (finished) {
        onExit();
        setUser({ ...user, photoUrl: " " });
      }
    });
  };

  show ? slide() : hide();

  const chopUrl = (url) => {
    var result;
    result = url.replace("s96-c", "s800-c");
    return result;
  };

  const chopTimeStamp = (timestamp) => {
    var a = new Date(timestamp);

    return (
        <View style={{ justifyContent: "center" }}>
          <Text style={styles.date}>{a.toDateString()}</Text>
          <Text style={[styles.date]}>
            {a.toTimeString().substring(0, 5) + " Uhr"}
          </Text>
        </View>
      );
    };

    const getHighestCounter = () => {
        let counters = [
            ["Joint",user.joint_counter],
            ["Bong",user.bong_counter],
            ["Vape",user.vape_counter],
            ["Pipe",user.pipe_counter],
            ["Cookie",user.cookie_counter]
        ];
        let highest = [" ",0]
        for (let i = 0; i<counters.length; i++) {
            counters[i][1] > highest[1] ? () => {
                highest[0] = counters[i][0]; 
                highest[1] = counters[i][1];
            }
             : null;
        }
        return highest;
        
    }

    const calcLevelName = (counter) => {
        let indicator = Math.floor(counter / 70);
        return indicator > levels.length - 1
          ? levels[levels.length - 1].name
          : levels[Math.floor(counter / 70)].name;
      };
    
      const getGradientColors = (counter) => {
        let indicator = Math.floor(counter / 70);
        return indicator > levels.length - 1
          ? levels[levels.length - 1].colors
          : levels[Math.floor(counter / 70)].colors;
      };

    

  const removeFriend = async (id) => {
    try {
      const docRef = doc(firestore, "users", realuser.id);
      const docSnap = await getDoc(docRef);

      var buffer;
      if (docSnap.exists()) {
        buffer = docSnap.data().friends;
      }

      updateDoc(docRef, {
        friends: buffer.filter((item) => item != id),
      });
    } catch (e) {
      console.log("Error", e);
    }
    setModalVisible(false);
    refresh();
  };

  return (
    <>
      {user ? (
        <Animated.View
          style={[styles.container, { transform: [{ translateX: slideAnim }] }]}
        >
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <View style={styles.modal_container}>
                <>
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text style={styles.heading}>
                      {user.username} als Freund entfernen?
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
                        onPress={() => setModalVisible(false)}
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
                        onPress={() => {
                          removeFriend(userid);
                          hide();
                        }}
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
                </>
              </View>
            </View>
          </Modal>

          {/* <View style={{height: 50, zIndex: 6, position: "absolute"}}></View> */}

          <View
            style={{
              zIndex: 6,
              paddingLeft: 15,
              marginTop: 50,
              position: "absolute",
            }}
          >
            <BackButton onPress={() => onExit()} />
          </View>

          <Image
            style={[styles.image, { height: screen_width }]}
            source={{ uri: user.photoUrl }}
          />

          <ScrollView style={{ zIndex: 5, position: "relative" }}>
            <View style={{ width: "100%", height: screen_width }}></View>
            <View
              style={{
                backgroundColor: "#171717",
                height: 800,
                position: "relative",
                bottom: 0,
              }}
            >
              <View style={{ height: 20 }}></View>

              <Text style={styles.username}>{user.username}</Text>
              <Text style={styles.member_since}>
                Mitglied seit: {user.member_since}
              </Text>

              <View style={{ height: 20 }}></View>

              <View
                style={{
                  width: "100%",
                  alignSelf: "center",
                  backgroundColor: "#1E1E1E",
                }}
              >
                <View style={{ height: 15 }}></View>
                <Text style={styles.label}>Gesamt</Text>
                {user.main_counter ? (
                  <Text style={styles.value}>{user.main_counter}</Text>
                ) : (
                  <Text style={styles.label}>
                    Dieser User teilt seinen Gesamt-Counter momentan nicht.
                  </Text>
                )}
              </View>

              <View style={{ width: "100%", alignSelf: "center" }}>
                <View style={{ height: 15 }}></View>
                <Text style={styles.label}>Letzte Aktivität</Text>
                <View style={{ height: 10 }}></View>
                <View style={styles.activity_container}>
                  {user.last_act_timestamp != null &&
                  user.last_act_type != null ? (
                    <>
                      <View
                        style={{
                          flex: 2,
                          alignItems: "center",
                          alignContent: "center",
                        }}
                      >
                        <Text style={styles.date}>
                          {chopTimeStamp(user.last_act_timestamp)}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          alignItems: "center",
                          alignContent: "center",
                        }}
                      >
                        {user.last_act_type == "joint" ? (
                          <Image
                            style={styles.type_image_joint}
                            source={require("./img/joint.png")}
                          />
                        ) : null}
                        {user.last_act_type == "bong" ? (
                          <Image
                            style={styles.type_image_bong}
                            source={require("./img/bong.png")}
                          />
                        ) : null}
                        {user.last_act_type == "vape" ? (
                          <Image
                            style={styles.type_image_vape}
                            source={require("./img/vape.png")}
                          />
                        ) : null}
                      </View>
                    </>
                  ) : (
                    <Text style={styles.label}>
                      Dieser User teilt seine letzte Aktivität momentan nicht.
                    </Text>
                  )}
                </View>
                <View style={{ height: 20 }}></View>
              </View>

              <Text>Hinzufügen: aktueller Streak, Main-Typ, </Text>

              <View style={{ bottom: 0, position: "absolute", width: "100%" }}>
                <TouchableNativeFeedback
                  background={TouchableNativeFeedback.Ripple(
                    "rgba(255,255,255,0.05)",
                    false
                  )}
                  onPress={() => setModalVisible(true)}
                >
                  <View style={styles.touchable_delete}>
                    <Text style={styles.delete_text}>Als Freund entfernen</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      ) : null}
    </>
  );
};

export default FriendPage;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#171717",
    zIndex: 5,
    position: "absolute",
  },
  image: {
    width: "100%",
    position: "absolute",
    zIndex: 4,
  },
  username: {
    color: "white",
    fontSize: 35,
    fontFamily: "PoppinsBlack",
    marginLeft: 20,
  },
  member_since: {
    color: "rgba(255,255,255,0.5)",
    fontFamily: "PoppinsLight",
    marginLeft: 20,
    marginTop: -10,
  },
  label: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 15,
    fontFamily: "PoppinsLight",
    textAlignVertical: "center",
    marginLeft: 20,
  },
  value: {
    color: "#0080FF",
    fontSize: 50,
    fontFamily: "PoppinsBlack",
    textAlignVertical: "center",
    marginTop: -15,
    textAlign: "center",
  },
  date: {
    color: "white",
    fontSize: 16,
    fontFamily: "PoppinsLight",
    textAlignVertical: "center",
    textAlign: "left",
  },
  type_image_joint: {
    width: 30,
    height: 80,
    marginTop: 5,
    marginBottom: 10,
    alignSelf: "center",
  },
  type_image_bong: {
    width: 40,
    height: 70,
    marginTop: 5,
    marginBottom: 10,
    alignSelf: "center",
  },
  type_image_vape: {
    width: 30,
    height: 90,
    marginTop: 5,
    marginBottom: 10,
    alignSelf: "center",
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
  activity_container: {
    backgroundColor: "#1E1E1E",
    borderRadius: 25,
    flexDirection: "row",
    width: "70%",
    alignItems: "center",
    alignContent: "center",
    alignSelf: "center",
  },
});
