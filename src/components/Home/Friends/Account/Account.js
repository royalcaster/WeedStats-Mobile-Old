//React
import React, { useState, useRef } from "react";
import { View, StyleSheet, Text, Animated, Easing, Dimensions, TouchableNativeFeedback, Modal, PanResponder } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Custom Components
import Feedback from "./Feedback/Feedback";
import Donation from "./Donation/Donation";
import Levels from "./Levels/Levels";
import ProfileImage from "../../../common/ProfileImage";
import Button from "../../../common/Button";
import BackButton from "../../../common/BackButton";

//Tools
import { convertMemberSince } from "../../../../data/DateConversion";

//Third Party
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Antdesign from "react-native-vector-icons/AntDesign";
import { responsiveFontSize, responsiveHeight } from "react-native-responsive-dimensions";

//Firebase
import { doc, deleteDoc } from "firebase/firestore";
import { firestore } from "../../../../data/FirebaseConfig";

const Account = ({ user, handleLogOut, onexit, show }) => {
  
  const screen_height = Dimensions.get("screen").height;
  const [showLevels, setShowLevels] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pan = useRef(new Animated.Value(0)).current;

  const slide = () => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    Animated.timing(pan, {
      toValue: responsiveHeight(-1),
      duration: 400,
      easing: Easing.bezier(0.2, 1, 0.21, 0.97),
      useNativeDriver: true,
    }).start();
  };

  const hide = () => {
    Animated.timing(pan, {
      toValue: screen_height,
      duration: 300,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        onexit();
        opacityAnim.setValue(0);
      }
    });
  };

  show ? slide() : hide();

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
    console.log("Aktuell passiert hier garnix.");
  };

  const [showDelete, setShowDelete] = useState(false);

  //PanResponder test -> so funktionierts endlich, so ein dreck ehrlich
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (event, gesture) => {
      /* if (gesture?.moveX > gesture?.moveY) {
        return false;
      } */
      return true;
    },
    onPanResponderMove: (event, gesture) => {
      if (gesture.dy > 0 ) {pan.setValue(gesture.dy); opacityAnim.setValue(1 - (gesture.dy / 700))}
    },
    onPanResponderRelease: (event, gesture) =>  {
      if (gesture.dy > screen_height/ 10 || gesture.vy > 1) {hide()} else{slide();}
    }
 });

  return (
    <Animated.View
      style={[
        {
          opacity: opacityAnim,
          height: "100%",
          transform: [{ translateY: pan }],
        },
        styles.container,
      ]}
      {...panResponder.panHandlers}
    >{/* 
      {showLevels ? <Levels onexit={() => setShowLevels(false)} /> : null} */}
        <Levels onexit={() => setShowLevels(false)} show={showLevels}/>
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
            flex: 1
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
            <View style={{ flex: 1}}>
              <Text style={[styles.text, { fontSize: 15, maxWidth: "80%"}]}>
                Das kann nicht rückgängig gemacht werden. Willst du dieses WeedStats-Konto wirklich
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


      <View
        style={{
          flex: 1,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          backgroundColor: "#131520",
        }}
      >
        <View style={{ width: "100%", justifyContent: "center", flex: 1}}>
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
              color: "rgba(255,255,255,0.75)",
              fontSize: responsiveFontSize(1.7),
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
            flex: 3,
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
              fontSize: responsiveFontSize(1.7),
              fontFamily: "PoppinsLight",
              letterSpacing: 2,
            }}
          >
            MITGLED SEIT: <Text style={{color: "#0781E1"}}>{convertMemberSince(user.member_since)}</Text>
          </Text>
        </View>
        {/* <Button
          fontColor={"white"}
          onPress={doWhatever}
          borderradius={100}
          color={"#1E1E1E"}
          title={"Bugfix!"}
          icon={<FontAwesome name="gears" style={styles.money_icon} />}
        /> */}

        <View style={{ height: 15 }}></View>

        <View style={{flex: 6}}>

        <Button
          fontColor={"white"}
          onPress={() =>{ setShowLevels(true)}}
          borderradius={100}
          color={"#1E2132"}
          title={" Levelübersicht"}
          icon={<FontAwesome name="trophy" style={styles.money_icon} />}
        />
        
        {/*
        <View style={{ height: 15 }}></View>

         <Button
          onPress={() => setShowFeedback(true)}
          title={" Feedback senden"}
          icon={<FontAwesome name="gears" style={styles.money_icon} />}
          borderradius={100}
          color={"#1E1E1E"}
          fontColor={"white"}
        /> */}

        <View style={{ height: 15 }}></View>

        <Button
          onPress={() => setShowDonation(true)}
          title={"WeedStats unterstützen"}
          icon={<MaterialIcons name="euro" style={styles.money_icon} />}
          borderradius={100}
          color={"#1E2132"}
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
        </View>
      </View>
    </Animated.View>
  );
}

export default Account;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    zIndex: 1,
    position: "absolute",
    backgroundColor: "#1E2132",
    alignSelf: "center",
    marginTop: 50
  },
  username: {
    color: "white",
    fontSize: responsiveFontSize(2.2),
    fontFamily: "PoppinsBlack",
  },
  email: {
    color: "rgba(255,255,255,0.75)",
    fontSize: responsiveFontSize(1.6),
    fontFamily: "PoppinsLight",
  },
  money_icon: {
    fontSize: 25,
    color: "white",
    textAlignVertical: "center",
  },
  touchable_delete: {
    width: "100%",
    alignSelf: "center",
    height: 60
  },
  delete_text: {
    color: "#eb4034",
    fontFamily: "PoppinsLight",
    alignSelf: "center",
    textAlignVertical: "center",
    height: "100%",
  },
  heading: {
    color: "white",
    textAlign: "center",
    fontFamily: "PoppinsBlack",
    fontSize: 22,
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
  text: {
    color: "white",
    fontFamily: "PoppinsLight",
    textAlign: "center",
    alignSelf: "center"
  },
});
