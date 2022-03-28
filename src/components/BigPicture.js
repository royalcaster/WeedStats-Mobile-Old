import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  View,
  Animated,
  Easing,
  StyleSheet,
  Pressable,
  Text,
  Image,
  Dimensions,
} from "react-native";
import ProfileImage from "./ProfileImage";

import { firestore } from "./FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const BigPicture = ({ message, show, onExit }) => {
  const [profileImage, setProfileImage] = useState(" ");

  useEffect(() => {
    getProfileImg(message.sender);
  }, [message]);

  const windowWidth = Dimensions.get("window").width;
  const slideAnim = useRef(new Animated.Value(windowWidth)).current;

  show
    ? Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.bezier(0, 1.02, 0.21, 0.97),
      }).start()
    : Animated.timing(slideAnim, {
        toValue: windowWidth,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.bezier(0, 1.02, 0.21, 0.97),
      }).start();

  const getProfileImg = async (username) => {
    try {
      const userRef = doc(firestore, "users", username);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setProfileImage(docSnap.data().photoUrl);
      }
    } catch (e) {
      console.log("Error:", e);
    }
  };

  const chopDate = (string) => {
    var result =
      string.substring(8, 10) +
      ". " +
      getMonth(string.substring(4, 7)) +
      " " +
      string.substring(11, 15);

    return result;
  };

  const getMonth = (string) => {
    switch (string) {
      case "Jan":
        return "Januar";
      case "Feb":
        return "Februar";
      case "Mar":
        return "März";
      case "Apr":
        return "April";
      case "May":
        return "Mai";
      case "Jun":
        return "Juni";
      case "Jul":
        return "Juli";
      case "Aug":
        return "August";
      case "Sep":
        return "September";
      case "Oct":
        return "Oktober";
      case "Nov":
        return "November";
      case "Dec":
        return "Dezember";
    }
  };

  return (
    <Animated.View
      style={[{ transform: [{ translateX: slideAnim }] }, styles.animated]}
    >
      <Pressable style={styles.container} onPress={onExit}>
        <View>
          <View style={styles.header}>
            <View style={{ height: 50 }}></View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 15 }}></View>
              <ProfileImage x={50} type={1} url={profileImage} />
              <View style={{ height: "100%" }}>
                <View style={{ height: 5 }}></View>
                <Text style={styles.username}>{message.sender}</Text>
                <Text
                  style={[
                    styles.username,
                    {
                      fontFamily: "PoppinsLight",
                      fontSize: 14,
                      color: "#d4d4d4",
                    },
                  ]}
                >
                  {"Am" +
                    " " +
                    chopDate(message.date.day) +
                    " um " +
                    message.date.time.substring(0, 5)}
                </Text>
              </View>
            </View>
            <View style={{ height: 10 }}></View>
          </View>
          <Image style={styles.image} source={{ uri: message.download_uri }} />
          <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
            <Text
              style={[
                styles.mood_text,
                { fontFamily: "PoppinsBlack", fontSize: 40, marginBottom: -8 },
              ]}
            >
              {message.mood}/10
            </Text>
            <Text style={styles.mood_text}>Stimmung </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default BigPicture;

const styles = StyleSheet.create({
  animated: {
    height: "100%",
    width: "100%",
    position: "absolute",
    zIndex: 20,
  },
  container: {
    position: "absolute",
    height: "100%",
    width: "100%",
    zIndex: 20,
  },
  image: {
    height: "100%",
  },
  header: {
    backgroundColor: "rgba(0,0,0,0.4)",
    position: "absolute",
    zIndex: 10,
    width: "100%",
  },
  username: {
    color: "white",
    fontFamily: "PoppinsMedium",
    fontSize: 19,
    marginLeft: 10,
    marginBottom: -5,
  },
  mood_text: {
    color: "white",
    fontFamily: "PoppinsLight",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 10,
  },
});
