import React, { useEffect, useRef, useState } from "react";
import { Animated, View, StyleSheet, Text, Easing, Image} from "react-native";
import ProfileImage from "./ProfileImage";
import levels from "../Levels.json";

import { TouchableNativeFeedback } from "react-native";

//Firebase
import { setDoc, doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db, firestore } from "./FirebaseConfig";

const FriendListItem = ({ userid, onPress }) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slide1Anim = useRef(new Animated.Value(-500)).current;
  const slide2Anim = useRef(new Animated.Value(-500)).current;

  useEffect(() => {
    loadUser();
  }, []);

  const animate = () => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
      /* easing: Easing.bezier(0,1.02,.21,.97), */
    }).start();

    Animated.timing(slide1Anim, {
      toValue: 0,
      duration: 550,
      useNativeDriver: true,
      easing: Easing.bezier(0, 1.02, 0.21, 0.97),
    }).start();

    Animated.timing(slide2Anim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
      easing: Easing.bezier(0, 1.02, 0.21, 0.97),
    }).start();
  };

  const [user, setUser] = useState();
  const [counters, setCounters] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    try {
      const docRef = doc(firestore, "users", userid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUser({
          username: docSnap.data().username,
          photoUrl: docSnap.data().photoUrl,
        });
        setCounters([
          { type: "Joint", counter: docSnap.data().joint_counter },
          { type: "Bong", counter: docSnap.data().bong_counter },
          { type: "Vape", counter: docSnap.data().vape_counter },
          { type: "Pfeife", counter: docSnap.data().pipe_counter },
          { type: "Edible", counter: docSnap.data().cookie_counter },
        ]);
      }
    } catch (e) {
      console.log("Error:", e);
    }
    setIsLoading(false);
    animate();
  };

  const getTitle = () => {
    if (
      counters.forEach((entry) => {
        entry.counter == null;
      })
    ) {
      return "WeedStats-User";
    }

    counters.sort((a, b) => {
      return b.counter - a.counter;
    });
    return counters[0].type + "-" + calcLevelName(counters[0].counter);
  };

  const calcLevelName = (counter) => {
    let indicator = Math.floor(counter / 70);
    return indicator > levels.length - 1
      ? levels[levels.length - 1].name
      : levels[Math.floor(counter / 70)].name;
  };

  return (
    <>
      {!isLoading ? (
        <Animated.View style={[{ opacity: opacityAnim }, styles.container]}>
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(
              "rgba(255,255,255,0.05)",
              false
            )}
            onPress={onPress}
          >
            <View style={styles.touchable}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 20 }}></View>
                <Animated.View
                  style={{ transform: [{ translateX: slide1Anim }], zIndex: 2 }}
                >
                  <ProfileImage x={45} type={1} url={user.photoUrl} />
                </Animated.View>
                <View style={{ width: 20 }}></View>
                <Animated.View
                  style={{
                    flexDirection: "column",
                    transform: [{ translateX: slide2Anim }],
                    zIndex: 1,
                  }}
                >
                  <Text style={styles.username}>{user.username}</Text>
                  <View style={{flexDirection: "row", maxHeight: 30}}>
                    {Math.floor(counters[0].counter / 70) == 0 ? <Image style={styles.lvl_image} source={require('./img/lvl1.png')}/> : null}
                    {Math.floor(counters[0].counter / 70) == 1 ? <Image style={styles.lvl_image} source={require('./img/lvl2.png')}/> : null}
                    {/* {Math.floor(counters[0].counter / 70) == 2 ? <Image style={styles.lvl_image} source={require('./img/lvl3.png')}/> : null} */}
                    {/* {Math.floor(counters[0].counter / 70) == 3 ? <Image style={styles.lvl_image} source={require('./img/lvl4.png')}/> : null} */}
                    {/* {Math.floor(counters[0].counter / 70) == 4 ? <Image style={styles.lvl_image} source={require('./img/lvl5.png')}/> : null} */}
                    {/* {Math.floor(counters[0].counter / 70) == 5 ? <Image style={styles.lvl_image} source={require('./img/lvl6.png')}/> : null} */}
                    {Math.floor(counters[0].counter / 70) == 6 ? <Image style={styles.lvl_image} source={require('./img/lvl7.png')}/> : null}
                    <Text
                      style={[
                        styles.username,
                        {
                          fontFamily: "PoppinsLight",
                          fontSize: 12,
                          textAlignVertical: "center",
                        },
                      ]}
                    >
                      {getTitle()}{Math.floor(counters[0].counter / 70) == 1 ? "true" : "false"}
                    </Text>
                  </View>
                </Animated.View>
              </View>
            </View>
          </TouchableNativeFeedback>
        </Animated.View>
      ) : null}
    </>
  );
};

export default FriendListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 80,
  },
  username: {
    color: "rgba(255,255,255,0.8)",
    fontFamily: "PoppinsBlack",
    fontSize: 15,
  },
  touchable: {
    width: "100%",
    justifyContent: "center",
  },
  lvl_image: {
    height: 25,
    width: 25, 
    marginTop: -4,
    marginRight: 2,
    marginLeft: -5,
    opacity: 0.85
  }
});
