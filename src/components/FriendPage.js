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
  ActivityIndicator,
} from "react-native";

import Antdesign from "react-native-vector-icons/AntDesign";
import levels from "../Levels.json";
import Best from "./Best";

//Firebase
import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db, firestore } from "./FirebaseConfig";

import BackButton from "./BackButton";

const FriendPage = ({ show, userid, onExit, realuser, refresh }) => {
    
  const screen_width = Dimensions.get("screen").width;

  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);

  const slideAnim = useRef(new Animated.Value(screen_width)).current;

  const slideAnim2 = useRef(new Animated.Value(-50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const opacityAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (userid) {
      getUser();
    }
  }, [userid]);

  const slideCounters = () => {
    console.log("test");

    slideAnim2.setValue(-50);
    opacityAnim.setValue(0);
    opacityAnim2.setValue(0);

    Animated.timing(slideAnim2,{
      delay: 200,
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.bezier(0, 1.02, 0.21, 0.97)
    }).start();

    Animated.timing(opacityAnim,{
      delay: 200,
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(opacityAnim2,{
      /* delay: 400, */
      toValue: 0.2,
      duration: 300,
      useNativeDriver: true,
    }).start();

  }

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
          joint_counter: docSnap.data().joint_counter,
          bong_counter: docSnap.data().bong_counter,
          vape_counter: docSnap.data().vape_counter,
          pipe_counter: docSnap.data().pipe_counter,
          cookie_counter: docSnap.data().cookie_counter,
          best: getSortedCounters([
            { type: "Joint", counter: docSnap.data().joint_counter },
            { type: "Bong", counter: docSnap.data().bong_counter },
            { type: "Vape", counter: docSnap.data().vape_counter },
            { type: "Pfeife", counter: docSnap.data().pipe_counter },
            { type: "Edible", counter: docSnap.data().cookie_counter },
          ])
        });
        /* setCounters([
            { type: "Joint", counter: docSnap.data().joint_counter },
            { type: "Bong", counter: docSnap.data().bong_counter },
            { type: "Vape", counter: docSnap.data().vape_counter },
            { type: "Pfeife", counter: docSnap.data().pipe_counter },
            { type: "Edible", counter: docSnap.data().cookie_counter },
          ]); */
          setLoading(false);
          slideCounters();
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

  const getSortedCounters = (array) => {
    array.sort((a, b) => {
      return b.counter - a.counter;
    });
    return array[0];
  }

  const getTitle = () => {
    /* if (
      counters.forEach((entry) => {
        entry.counter == null;
      })
    ) {
      return "WeedStats-User";
    } */
    return user.best.type + "-" + calcLevelName(user.best.counter);
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
            <BackButton onPress={() => {onExit();setLoading(true);}} />
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
                <View style={{ height: 30 }}></View>
                {!loading ? <>
                {user.main_counter ? (
                  <Animated.View style={{opacity: opacityAnim,transform: [{translateX: slideAnim2}]}}>
                    <Text style={styles.value}>{user.main_counter}</Text>
                  </Animated.View>
                ) : (
                  <Text style={styles.label}>
                    Dieser User teilt seinen Gesamt-Counter momentan nicht.
                  </Text>
                )}
                <Text style={[styles.label,{marginTop: -25}]}>GESAMT</Text>
                </> : <View style={{height: 60, justifyContent: "center"}}>
                <ActivityIndicator size={"small"} color={"#0080FF"}/>
              </View>}
                <View style={{ height: 30 }}></View>

                {!loading ? 

                <Animated.View style={{width: "95%", flexDirection: "row", alignSelf: "center", height: 60}}>
                    <View style={{flex: 1}}>
                      <Animated.View style={{opacity: opacityAnim, transform: [{translateX: slideAnim2}]}}>
                        <Text style={styles.small_counter}>{user.joint_counter}</Text>
                      </Animated.View>
                        <Text style={styles.small_label}>JOINT</Text>
                        <Animated.Image style={[styles.small_image,{opacity: opacityAnim2}]} source={require('./img/joint.png')}/>
                    </View>
                    <View style={{flex: 1}}>
                     <Animated.View style={{opacity: opacityAnim, transform: [{translateX: slideAnim2}]}}>
                        <Text style={styles.small_counter}>{user.bong_counter}</Text>
                      </Animated.View>
                        <Text style={styles.small_label}>BONG</Text>
                        <Animated.Image style={[styles.small_image,{width: 50, marginTop: -10, opacity: opacityAnim2}]} source={require('./img/bong.png')}/>
                    </View>
                    <View style={{flex: 1}}>
                      <Animated.View style={{opacity: opacityAnim, transform: [{translateX: slideAnim2}]}}>
                        <Text style={styles.small_counter}>{user.vape_counter}</Text>
                      </Animated.View>
                        <Text style={styles.small_label}>VAPE</Text>
                        <Animated.Image style={[styles.small_image,{height: 90, width: 40, marginTop: -17, opacity: opacityAnim2}]} source={require('./img/vape.png')}/>
                    </View>
                    <View style={{flex: 1}}>
                     <Animated.View style={{opacity: opacityAnim, transform: [{translateX: slideAnim2}]}}>
                        <Text style={styles.small_counter}>{user.pipe_counter}</Text>
                      </Animated.View>
                        <Text style={styles.small_label}>PFEIFE</Text>
                        <Animated.Image style={[styles.small_image,{height: 100, width: 60, marginTop: -20, opacity: opacityAnim2}]} source={require('./img/pipe.png')}/>
                    </View>
                    <View style={{flex: 1}}>
                      <Animated.View style={{opacity: opacityAnim, transform: [{translateX: slideAnim2}]}}>
                        <Text style={styles.small_counter}>{user.cookie_counter}</Text>
                      </Animated.View>
                        <Text style={styles.small_label}>EDIBLE</Text>
                        <Animated.Image style={[styles.small_image,{height: 65, width: 60, marginTop: 0, opacity: opacityAnim2}]} source={require('./img/cookie.png')}/>
                    </View>
                </Animated.View>
                  : 
                <View style={{height: 60, justifyContent: "center"}}>
                  <ActivityIndicator size={"small"} color={"#0080FF"}/>
                </View>}

                <View style={{ height: 40 }}></View>
              </View>


              <View style={{ width: "100%", alignSelf: "center", backgroundColor: "#0F0F0F"}}>
                <View style={{ height: 30 }}></View>
                <Text style={styles.label}>BESTLEISTUNG</Text>
                <View style={{ height: 10 }}></View>
                {!loading ? 

                <Best colors={getGradientColors(user.best.counter)} level_index={Math.floor(user.best.counter / 70)} title={getTitle()}/>

                : 
                <View style={{height: 80, justifyContent: "center"}}>
                  <ActivityIndicator size={"small"} color={"#0080FF"}/>
                </View>}
                <View style={{ height: 35 }}></View>
              </View>

              <View style={{ width: "100%", alignSelf: "center" }}>
                <View style={{ height: 30 }}></View>
                <Text style={styles.label}>LETZTE AKTIVITÄT</Text>
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
    marginTop: -15,
  },
  label: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    fontFamily: "PoppinsLight",
    letterSpacing: 3,
    textAlignVertical: "center",
    textAlign: "center"
  },
  value: {
    color: "white",
    fontSize: 60,
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
  small_counter: {
    zIndex: 2,
    color: "white",
    fontSize: 30,
    fontFamily: "PoppinsBlack",
    textAlign: "center",
    marginTop: 5,
    opacity: 1
  },
  small_image: {
      height: 80,
      width: 30,
      position: "absolute",
      zIndex: -1,
      opacity: 0.2,
      alignSelf: "center",
      marginTop: -10
  },
  small_label: {
    textAlign: "center",
    zIndex: 1,
    color: "rgba(255,255,255,1)",
    fontFamily: "PoppinsLight",
    fontSize: 12,
    marginTop: -15
  }
});
