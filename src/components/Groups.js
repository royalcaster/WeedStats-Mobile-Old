import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Easing,
  TouchableNativeFeedback,
  ActivityIndicator,
} from "react-native";
import { useFonts } from "expo-font";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import { firestore } from "./FirebaseConfig";
import { useState, useEffect, useRef } from "react";
import uuid from "react-native-uuid";
import Account from "./Account";
import FriendPage from "./FriendPage";
import FriendListItem from "./FriendListItem";
import SearchPanel from './SearchPanel'
import Feather from 'react-native-vector-icons/Feather'
import Antdesign from 'react-native-vector-icons/AntDesign'
import FriendRequests from "./FriendRequests";
import Feedback from "./Feedback";
import Levels from './Levels'
import CustomLoader from "./CustomLoader";
import { ScrollView } from "react-native-collapsible-tab-view";

const Groups = ({ user, handleLogOut }) => {
  
  const [rippleColor, setRippleColor] = useState("rgba(255,255,255,0.1)");
  const [rippleOverflow, setRippleOverflow] = useState(false);

  const [friendList, setFriendList] = useState();

  const [showFriend, setShowFriend] = useState(false);
  const [activeFriend, setActiveFriend] = useState();

  const [showAddFriend, setShowAddFriend] = useState(false);

  const [loading, setLoading] = useState(true);
  const [showDonation, setShowDonation] = useState(false);

  const [showAccount, setShowAccount] = useState(false);
  const [showGroup, setShowGroup] = useState(false);
  const [showRequests, setShowRequests] = useState();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const accountAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    getFriendList();
  }, []);

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

  const getFriendList = async () => {
    const docRef = doc(firestore, "users", user.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        setFriendList(docSnap.data().friends);
    }
    setLoading(false);
  }

  const [loaded] = useFonts({
    PoppinsBlack: require("./fonts/Poppins-Black.ttf"),
    PoppinsMedium: require("./fonts/Poppins-Medium.ttf"),
    PoppinsLight: require("./fonts/Poppins-Light.ttf"),
  });


  return (
    <>
      {showAddFriend ? <SearchPanel user={user} onExit={() => setShowAddFriend(false)}/> : null}
      {showRequests ? <FriendRequests user={user} onExit={() => setShowRequests(false)} refresh={() => {getFriendList()}}/> : null}

      <FriendPage 
        show={showFriend} 
        userid={activeFriend} 
        onExit={() => {setShowFriend(false); setActiveFriend(null)}} 
        realuser={user} 
        refresh={() => {getFriendList(); setActiveFriend(null); setShowFriend(false);}}/>

      <Account
        user={user}
        handleLogOut={handleLogOut}
        onexit={() => setShowAccount(false)}
        show={showAccount}
      />

      <Animated.View style={[{ opacity: fadeAnim }, styles.container]}>
        <View style={{ height: 50 }}></View>
        <View style={{ alignItems: "center", flexDirection: "row" }}>
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
                  { height: 50, backgroundColor: "#171717", width: 50 },
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
                  { height: 50, backgroundColor: "#171717", width: 50 },
                ]}
              >
                <Feather name="user-check" style={styles.icon} />
              </View>
            </TouchableNativeFeedback>

            <View style={{ width: 20 }}></View>
          </View>
        </View>

      <ScrollView>
      {!loading ? <>
        
        {friendList.length != 0 ? friendList.map((friend) => {
                  return <FriendListItem key={uuid.v4()} userid={friend} onPress={() => {
                    setActiveFriend(friend);
                    setShowFriend(true);
                  }}/>
              })
              : <>
              <View style={{height: 50}}></View>
                <Antdesign name="frowno" style={{fontSize: 70, color: "rgba(255,255,255,0.25)", textAlign: "center",marginBottom: 20}}/>
                <Text style={[styles.empty,{fontSize: 20, fontFamily: "PoppinsLight"}]}>Keine Freunde</Text>
                <Text style={styles.empty}>Tippe auf das + oben rechts</Text>
                <View style={{alignSelf: "center"}}>
                  <CustomLoader x={80}/>
                </View>
              </>
              }
              </> : null}
      </ScrollView>

        <View style={{ height: 20 }}></View>

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
            borderTopColor: "#0080FF"
          }}
        >
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(
              "rgba(255,255,255,0.1)",
              rippleOverflow
            )}
            onPress={() => setShowAccount(true)}
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
                    fontSize: 16,
                  }}
                >
                  {user.username}
                </Text>
                <Text
                  style={{
                    left: 15,
                    fontFamily: "PoppinsLight",
                    color: "#c4c4c4",
                    fontSize: 12,
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
    backgroundColor: "#171717",
    height: "100%",
    width: "100%",
    zIndex: 0
  },
  heading: {
    fontFamily: "PoppinsBlack",
    color: "white",
    fontSize: 20,
    marginLeft: 30,
  },
  icon: {
    textAlignVertical: "center",
    color: "white",
    fontSize: 20,
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
    backgroundColor: "#0F0F0F"
  },
  empty: {
        color: "rgba(255,255,255,0.5)",
        alignSelf: "center",
        fontFamily: "PoppinsLight",
        fontSize: 12
    }
});
