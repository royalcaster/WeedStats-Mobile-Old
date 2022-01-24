import React from "react";
import {
  View,
  Pressable,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
  TouchableNativeFeedback,
} from "react-native";
import { useFonts } from "expo-font";

import {
  setDoc,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
  addDoc,
  limitToLast,
  query,
} from "firebase/firestore";
import {
  ref,
  push,
  getDatabase,
  set,
  onValue,
  onChildAdded,
} from "firebase/database";
import { db, firestore } from "./FirebaseConfig";

import { useState, useEffect, useRef } from "react";
import uuid from "react-native-uuid";

import Account from "./Account";
import OptionPanel from "./OptionPanel";
import Donation from "./Donation";
import Group from "./Group";
import GroupListItem from "./GroupListItem";
import FriendPage from "./FriendPage";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FriendListItem from "./FriendListItem";
import SearchPanel from './SearchPanel'

import Feather from 'react-native-vector-icons/Feather'
import Antdesign from 'react-native-vector-icons/AntDesign'
import FriendRequests from "./FriendRequests";

const Groups = ({ user, handleLogOut }) => {
  const defaultGroup = {
    title: "",
    members: ["1", "2", "3"],
    admin: "",
    createdon: "",
    messages: [],
  };

  const [rippleColor, setRippleColor] = useState("rgba(255,255,255,0.1)");
  const [rippleOverflow, setRippleOverflow] = useState(false);

  const [friendList, setFriendList] = useState();

  const [showFriend, setShowFriend] = useState(false);
  const [activeFriend, setActiveFriend] = useState();

  const [showAddFriend, setShowAddFriend] = useState(false);

  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
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
      duration: 300,
      easing: Easing.bezier(0, 1.02, 0.21, 0.97),
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

  const hideCreateGroup = () => {
    setShowCreateGroup(false);
  };

  const hideDonation = () => { 
    setShowDonation(false);
  };

  const hideMenu = () => {
    setShowMenu(false);
  };

  const hideAccount = () => {
    setShowAccount(false);
  };

  const hideGroup = () => {
    setShowGroup(false);
    getGroupList();
  };

  const [loaded] = useFonts({
    PoppinsBlack: require("./fonts/Poppins-Black.ttf"),
    PoppinsMedium: require("./fonts/Poppins-Medium.ttf"),
    PoppinsLight: require("./fonts/Poppins-Light.ttf"),
  });

  //Gruppen laden für Social-Sektor
  const [groupList, setGroupList] = useState([]);

  const getMessageList = (group) => {
    var messages_buffer = [];
    const messageRef = ref(db, "groups/" + group + "/messages");
    onChildAdded(messageRef, (snapshot) => {
      messages_buffer.push({
        type: snapshot.val().type,
        date: snapshot.val().date,
        sender: snapshot.val().sender,
        download_uri: snapshot.val().download_uri,
        mood: snapshot.val().mood,
        img_id: snapshot.val().img_id,
      });
    });
    return messages_buffer;
  };

  var groupIDs;
  const getGroupList = async () => {
    setGroupList([]);
    try {
      const docRef = doc(firestore, "users", user.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        groupIDs = docSnap.data().groups;
      }

      groupIDs.forEach((group) => {
        const groupRef = ref(db, "groups/" + group);
        onValue(groupRef, (snaphot) => {
          setGroupList((groupList) => [
            ...groupList,
            {
              admin: snaphot.val().admin,
              createdon: snaphot.val().createdon,
              id: snaphot.val().id,
              members: snaphot.val().members,
              title: snaphot.val().title,
              messages: getMessageList(group),
            },
          ]);
        });
        /* console.log(groupList.length) */
      });
    } catch (e) {
      console.log("Error:", e);
    }
  };

 /*  const createGroup = async (groupData) => {
    //Gruppe mit Datum und kurzer ID versehen
    groupData = {
      ...groupData,
      createdon: new Date().toLocaleDateString("de-DE"),
      id: uuid.v4().substring(0, 8),
    };

    const docRef = doc(firestore, "users", user.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      updateDoc(docRef, {
        groups: [...docSnap.data().groups, groupData.id],
      });
    }

    const groupRef = ref(db, "groups/" + groupData.id);
    set(groupRef, {
      id: groupData.id,
      admin: groupData.admin,
      createdon: groupData.createdon,
      title: groupData.title,
      members: groupData.members,
      messages: groupData.messages,
      counter: 0,
    });

    getGroupList();
  }; */

  /* const toggleLatestOnline = (group) => {
    console.log(group.id);
    var buffer = {
      name: "",
      latestonline: "",
      index: 0,
    };
    const members_ref = ref(db, "groups/" + group.id + "/members");
    onChildAdded(members_ref, (member) => {
      if (member.val().name == user.username) {
        buffer.latestonline = member.val().latestonline;
        buffer.name = member.val().name;
        buffer.index = member.val().index;
      }
    });

    //Hier liegt das Problem, Gruppen werden aus einem Grund nach dem Update 2 mal angezeigt...
    const ref2 = ref(db, "groups/" + group.id + "/members/" + buffer.index);
    if (group.messages.length > 0) {
      set(ref2, {
        index: buffer.index,
        name: buffer.name,
        latestonline: group.messages.length,
      });
    }
  }; */

  return (
    <>
      {showAccount ? (
        <Account
          user={user}
          handleLogOut={handleLogOut}
          onexit={hideAccount}
          onShowDonation={() => {
            setShowDonation(true);
            hideAccount();
          }}
        />
      ) : null}
      {showDonation ? (
        <Donation
          onexit={() => {
            setShowAccount(true);
            hideDonation();
          }}
        ></Donation>
      ) : null}

      {showAddFriend ? <SearchPanel user={user} onExit={() => setShowAddFriend(false)}/> : null}
      {showRequests ? <FriendRequests user={user} onExit={() => setShowRequests(false)}/> : null}
      
      <FriendPage show={showFriend} userid={activeFriend} onExit={() => {setShowFriend(false); setActiveFriend(null)}}/>

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

        <View style={{ height: 20 }}></View>

       {/*  {loading ? (
          <View style={{ justifyContent: "center", height: "75%" }}>
            <ActivityIndicator size="large" color="#0080FF" />
          </View>
        ) : (
          <>
            {groupList.map((group) => (
              <View key={uuid.v4()}>
                <GroupListItem
                  onPress={() => {
                    setShowGroup(true);
                    setActiveGroup(group);
                    toggleLatestOnline(group);
                  }}
                  group={group}
                  username={user.username}
                />
                <View
                  style={{
                    width: "100%",
                    height: 1,
                    backgroundColor: "rgba(255,255,255,0.05)",
                    bottom: 0,
                    position: "absolute",
                  }}
                ></View>
              </View>
            ))}
          </>
        )} */}

      <ScrollView style={{marginBottom: 45}}>
              {!loading ? <>{friendList.map((friend) => {
                  return <FriendListItem key={uuid.v4()} userid={friend} onPress={() => {
                    setActiveFriend(friend);
                    setShowFriend(true);
                  }}/>
              })}</> : null}
      </ScrollView>

        <View style={{ height: 20 }}></View>

        <Animated.View
          style={{
            transform: [{ translateY: accountAnim }],
            borderRadius: 10,
            overflow: "hidden",
            position: "absolute",
            bottom: 10,
            height: 55,
            width: "95%",
            alignSelf: "center",
          }}
        >
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(
              rippleColor,
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
  },
  heading: {
    fontFamily: "PoppinsBlack",
    color: "white",
    fontSize: 20,
    marginLeft: 30,
  },
  account_button: {
    width: 20,
    height: 80,
    position: "absolute",
    bottom: 0,
  },
  pressable: {
    textAlignVertical: "center",
    margin: 10,
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
    backgroundColor: "#1E1E1E"
  },
});
