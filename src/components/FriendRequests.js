import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  View,
  StyleSheet,
  Dimensions,
  Easing,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableNativeFeedback,
  Modal,
  BackHandler,
} from "react-native";

import Empty from "./Empty";

import BackButton from "./BackButton";
import RequestItem from "./RequestItem";

import uuid from "react-native-uuid";

//Firebase
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "./FirebaseConfig";

import Antdesign from "react-native-vector-icons/AntDesign";
import CustomLoader from "./CustomLoader";

const FriendResquests = ({ user, onExit, refresh }) => {
  const screen_height = Dimensions.get("screen").height;
  const slideAnim = useRef(new Animated.Value(screen_height)).current;

  const [modalVisible, setModalVisible] = useState(false);
  const [activeRequested, setActiveRequested] = useState(null);
  const [alreadySent, setAlreadySent] = useState(false);

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.bezier(0, 1.02, 0.21, 0.97),
    }).start();
    loadRequests();
  }, []);

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
      toValue: screen_height,
      duration: 300,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        onExit();
      }
    });
  };

  const loadRequests = async () => {
    var resultBuffer = [];

    try {
      const docRef = doc(firestore, "users", user.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        resultBuffer = docSnap.data().requests;
      }
    } catch (e) {
      console.log("Error", e);
    }
    setResults(resultBuffer);
    setLoading(false);
  };

  const makeFriendRequest = async (id) => {
    const docRef = doc(firestore, "users", id);
    const docSnap = await getDoc(docRef);

    var requested;
    if (docSnap.exists()) {
      requested = {
        id: docSnap.data().id,
        requests: docSnap.data().requests,
      };
    }

    if (requested.requests.includes(user.id)) {
      console.log("Anfrage bereits gesendet!");
      setAlreadySent(true);
    } else {
      try {
        const docRef = doc(firestore, "users", requested.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          var buffer = docSnap.data().requests;
          updateDoc(docRef, {
            requests: buffer.concat(user.id),
          });
        }
      } catch (e) {
        console.log("Error:", e);
      }
    }
    setModalVisible(false);
  };

  const acceptFriend = async (id) => {
    setLoading(true);

    const docRef = doc(firestore, "users", user.id);
    const docRef2 = doc(firestore, "users", id);

    var buffer = results.filter((item) => item != id);
    updateDoc(docRef, {
      requests: buffer,
    });
    console.log(buffer);

    var friends_buffer;
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      friends_buffer = docSnap.data().friends;
    }

    friends_buffer.push(id);

    updateDoc(docRef, {
      friends: friends_buffer,
    });

    const docSnap2 = await getDoc(docRef2);
    if (docSnap.exists()) {
      friends_buffer = docSnap.data().friends;
    }

    friends_buffer.push(user.id);

    updateDoc(docRef2, {
      friends: friends_buffer,
    });

    loadRequests();
    refresh();
    setLoading(false);
  };

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
    >
      <View style={{ height: 50 }}></View>

      <Modal
        animationType="fade"
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
            {!alreadySent ? (
              <>
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text style={styles.heading}>
                    Freundschaftsanfrage an{" "}
                    <Text>
                      {activeRequested ? activeRequested.username : null}
                    </Text>{" "}
                    senden?
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
                      onPress={() => makeFriendRequest(activeRequested.id)}
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
            ) : (
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Antdesign style={styles.info_icon} name="exclamationcircleo" />
                <View style={{ height: 30 }}></View>
                <Text style={styles.heading}>
                  Du hast bereits eine Freundschaftsanfrage an{" "}
                  <Text>
                    {activeRequested ? activeRequested.username : null}
                  </Text>{" "}
                  gesendet.
                </Text>
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
              </View>
            )}
          </View>
        </View>
      </Modal>

      <View
        style={{ width: "100%", flexDirection: "row", maxHeight: 60, flex: 1 }}
      >
        <View style={{ flex: 1, alignItems: "center" }}>
          <BackButton onPress={() => hide()} />
        </View>
        <View style={{ flex: 4, justifyContent: "center" }}>
          <Text style={styles.heading}>Anfragen</Text>
        </View>
      </View>

        {loading ? (
          <View style={{height: "100%", justifyContent: "center"}}>
            <CustomLoader x={80}/>
          </View>
        ) : (
          <>
            {results ? (
              <ScrollView style={{ width: "100%", flex: 1, alignSelf: "center", marginTop: 20 }}>
                {results.length != 0 ? (
                  results.map((result) => {
                    return (
                      <RequestItem
                        key={uuid.v4()}
                        userid={result}
                        onAccept={() => acceptFriend(result)}
                      />
                    );
                  })
                ) : null}
              </ScrollView>
            ) : 
            <View style={{height: "90%"}}><Empty title={"Du hast noch keine Anfragen."} tip={"Das wird schon noch!"}/></View>}
          </>
        )}

    </Animated.View>
  );
};

export default FriendResquests;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#131520",
    zIndex: 10,
    position: "absolute",
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
    fontSize: 20,
    textAlign: "left",
    marginLeft: 10,
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
  empty: {
    color: "rgba(255,255,255,0.5)",
    alignSelf: "center",
    fontFamily: "PoppinsLight",
    fontSize: 12,
  },
});
