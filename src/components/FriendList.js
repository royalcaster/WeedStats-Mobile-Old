import React, {useEffect, useRef, useState, memo} from "react";
import { Animated, View, StyleSheet, ScrollView } from "react-native";

import Empty from "./Empty";

import FriendListItem from "./FriendListItem";

import uuid from 'react-native-uuid'

import {
    doc,
    getDoc,
  } from "firebase/firestore";
  import { firestore } from "./FirebaseConfig";
import CustomLoader from "./CustomLoader";

const FriendList = memo(({ user, setActiveFriend, setShowFriend}) => {

    const [friendList, setFriendList] = useState();
    const [loading, setLoading] = useState(true);
/* 
    const [showFriend, setShowFriend] = useState(false);
    const [activeFriend, setActiveFriend] = useState();2 */

    useEffect(() => {
        getFriendList();
    },[]);


    const getFriendList = async () => {
        const docRef = doc(firestore, "users", user.id);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
            setFriendList(docSnap.data().friends);
        }
        setLoading(false);
      }


    return (
        <Animated.View style={[styles.container,{height: "80%"}]}>


           {!loading ?  <>
            
{friendList.length != 0 ? <ScrollView>
    {friendList.map((friend) => {
            return <FriendListItem key={uuid.v4()} userid={friend} onPress={() => {
              setActiveFriend(friend);
              setShowFriend(true);
            }}/>
        })}
  </ScrollView> : <View style={{height: "90%", justifyContent: "center"}}><Empty title={"Du hast noch keine Freunde"} tip={"Tippe auf das + oben rechts."}/></View>}

  
</> : <View style={{height: "90%", justifyContent: "center"}}><CustomLoader x={80}/></View>}

        </Animated.View>
    );
})

export default FriendList

const styles = StyleSheet.create({
    container: {
        width: "100%",
    }
});