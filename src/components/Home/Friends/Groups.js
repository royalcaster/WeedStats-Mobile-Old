//React
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Easing,
  TouchableNativeFeedback,
} from "react-native";

//Custom Components
import Account from "./Account/Account";
import FriendPage from "./FriendPage/FriendPage";
import SearchPanel from './SearchPanel/SearchPanel'
import FriendRequests from "../Friends/FriendRequests/FriendRequests";
import FriendList from "./FriendList/FriendList";

//Third Party
import Feather from 'react-native-vector-icons/Feather'
import { responsiveHeight, responsiveFontSize } from "react-native-responsive-dimensions";

const Groups = ({ user, handleLogOut, toggleNavbar }) => {
  
  const [rippleColor, setRippleColor] = useState("rgba(255,255,255,0.1)");
  const [rippleOverflow, setRippleOverflow] = useState(false);
  const [showFriend, setShowFriend] = useState(false);
  const [activeFriend, setActiveFriend] = useState();
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showGroup, setShowGroup] = useState(false);
  const [showRequests, setShowRequests] = useState();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const accountAnim = useRef(new Animated.Value(100)).current;;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    Animated.timing(accountAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.bezier(0, 1.02, 0.21, 0.97),
      useNativeDriver: true,
    }).start();
  }, [showGroup]);

  return (
    <>
      {showAddFriend ? <SearchPanel user={user} onExit={() => setShowAddFriend(false)}/> : null}
      {showRequests ? <FriendRequests user={user} onExit={() => setShowRequests(false)} refresh={() => {getFriendList()}}/> : null}

      <FriendPage 
        show={showFriend} 
        userid={activeFriend} 
        onExit={() => {setShowFriend(false); setActiveFriend(null);}} 
        realuser={user} 
        refresh={() => {getFriendList(); setActiveFriend(null); setShowFriend(false);}}
        toggleNavbar={toggleNavbar}
        />

      <Account
        user={user}
        handleLogOut={handleLogOut}
        onexit={() => setShowAccount(false)}
        show={showAccount}
      />

      <Animated.View style={[{ opacity: fadeAnim }, styles.container]}>
        <View style={{ height: responsiveHeight(7) }}></View>
        <View style={{ alignItems: "center", flexDirection: "row", marginBottom: 20}}>
          <Text style={styles.heading}>Freunde</Text>
          <View
            style={{ flexDirection: "row", right: 0, position: "absolute" }}
          >
            <TouchableNativeFeedback
              background={TouchableNativeFeedback.Ripple(rippleColor, true)}
              onPress={() => setShowAddFriend(true)}
            >
              <View
                style={[
                  styles.touchable,
                  { height: 50, backgroundColor: "#1E2132", width: 50 },
                ]}
              >
                <Feather name="plus" style={styles.icon} />
              </View>
            </TouchableNativeFeedback>

            <View style={{ width: 10 }}></View>

            <TouchableNativeFeedback
              background={TouchableNativeFeedback.Ripple(
                rippleColor,
                true
              )} onPress={() => setShowRequests(true)}
            >
              <View
                style={[
                  styles.touchable,
                  { height: 50, backgroundColor: "#1E2132", width: 50 },
                ]}
              >
                <Feather name="user-check" style={styles.icon} />
              </View>
            </TouchableNativeFeedback>

            <View style={{ width: 20 }}></View>
          </View>
        </View>

      <FriendList user={user} setActiveFriend={setActiveFriend} setShowFriend={setShowFriend}/>


        <Animated.View
          style={{
            transform: [{ translateY: accountAnim }],
            borderRadius: 10,
            overflow: "hidden",
            position: "absolute",
            bottom: 10,
            height: 60,
            width: "95%",
            alignSelf: "center",
            borderTopColor: "#131520"
          }}
        >
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(
              "rgba(255,255,255,0.1)",
              rippleOverflow
            )}
            onPress={() => {setShowAccount(true)}}
            style={{ width: "100%", height: "100%" }}
          >
            <View style={styles.touchable}>
              <View style={{ flex: 1 }}>
                <Image
                  source={{ uri: user.photoUrl }}
                  style={{ height: "100%", width: "100%" }}
                ></Image>
              </View>
              <View style={{ flex: 4, justifyContent: "center" }}>
                <Text
                  style={{
                    left: 15,
                    fontFamily: "PoppinsBlack",
                    color: "white",
                    fontSize: responsiveFontSize(2.0),
                  }}
                >
                  {user.username}
                </Text>
                <Text
                  style={{
                    left: 15,
                    fontFamily: "PoppinsLight",
                    color: "#c4c4c4",
                    fontSize: responsiveFontSize(1.6),
                    marginTop: -3,
                  }}
                >
                  Bong-Main
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>
        </Animated.View>
      </Animated.View>
      </>
  );
  
};

export default Groups;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E2132",
    height: "100%",
    width: "100%",
    zIndex: 0
  },
  heading: {
    fontFamily: "PoppinsBlack",
    color: "white",
    fontSize: responsiveFontSize(2.3),
    marginLeft: 30,
  },
  icon: {
    textAlignVertical: "center",
    color: "white",
    fontSize: responsiveFontSize(2.3),
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10
  },
  text: {
    textAlignVertical: "center",
    marginLeft: 10,
    color: "#c4c4c4",
    fontFamily: "PoppinsLight",
    fontSize: 16,
  },
  touchable: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#131520"
  },
  empty: {
        color: "rgba(255,255,255,0.5)",
        alignSelf: "center",
        fontFamily: "PoppinsLight",
        fontSize: 12
    }
});
