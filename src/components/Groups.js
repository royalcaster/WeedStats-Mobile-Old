import React from "react";
import { View, Pressable, Text, ScrollView, Image, StyleSheet, ActivityIndicator, Animated, Easing } from 'react-native'
import { useFonts } from "expo-font";

import { setDoc, doc, getDoc, updateDoc, Timestamp, addDoc } from "firebase/firestore";
import { ref, push } from "firebase/database";
import { db, firestore } from "./FirebaseConfig";

import { useState, useEffect, useRef } from "react";
import uuid from 'react-native-uuid'

import Account from './Account'
import OptionPanel from "./OptionPanel";
import Donation from "./Donation";
import CreateGroup from "./CreateGroup";
import Group from "./Group";

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';

const Groups = ({ user, handleLogOut }) => {

    const [loading, setLoading] = useState();
    const [showMenu, setShowMenu] = useState(false);
    const [showDonation, setShowDonation] = useState(false);
    const [showAccount, setShowAccount] = useState(false);
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const [showGroup, setShowGroup] = useState(false);
    const [activeGroup, setActiveGroup] = useState({
        title: "",
        members: ["1","2","3"],
        admin: "",
        createdon: ""
    }); 
 
    const fadeAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(
          fadeAnim,
          {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }
        ).start();
      }, [showGroup])

      

    useEffect(() => {
        setLoading(true);
        getGroupList();
    },[])

    const hideCreateGroup = () => {
        setShowCreateGroup(false);
    }

    const hideDonation = () => {
        setShowDonation(false);
    }

    const hideMenu = () => {
        setShowMenu(false);
    }

    const hideAccount = () => {
        setShowAccount(false);
    }

    const hideGroup = () => {
        setShowGroup(false);
    }

    const [loaded] = useFonts({
        PoppinsBlack: require("./fonts/Poppins-Black.ttf"),
        PoppinsLight: require("./fonts/Poppins-Light.ttf"),
      });

      const chopTitle = (title, n) => {
        if (title.length > n) {
            return title.substring(0,n) + "...";
        }
        else {
            return title;
        }
    }

    const chopMembers = (members) => {
        let result = "";
        members.forEach((member) => {
            result = result + member + ", "
        });
        return chopTitle(result, 35);
    }

  //Gruppen laden für Social-Sektor
  const [groupList, setGroupList] = useState([]);
  var groupIDs;

  const getGroupList = async () => { 
      setGroupList([]);
      try {
      //Referenz zu Nutzerdokument, durch Google-Username identifiziert
      const docRef = doc(firestore, "users", user.username);
      //Snapshot von diesem Dokument zum Lesen
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
          groupIDs = docSnap.data().groups;
      }
      }
      catch(e) {
          console.log("Error:",e)
      }

      //Aus Liste der IDs die Date der echten Gruppen laden
      try {
        const buffer = [];
          groupIDs.forEach( async (group) => {
              const docRef = doc(firestore, "groups", group);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                  setGroupList(groupList => [...groupList, {
                      admin: docSnap.data().admin,
                      createdon: docSnap.data().createdon,
                      id: docSnap.data().id,
                      members: docSnap.data().members,
                      title: docSnap.data().title,
                  }]);
                  /* buffer.push({
                      admin: docSnap.data().admin,
                      createdon: docSnap.data().createdon,
                      id: docSnap.data().id,
                      members: docSnap.data().members,
                      title: docSnap.data().title,
                  }); */
                  
              } 
              /* console.log(groupList[1].admin); */
          });
          
           /*  setGroupList(buffer);
            console.log(groupList) */
          
      }
      catch(e) {
          console.log("Error:",e)
      }
      setLoading(false);
  }


    const createGroup = async ( groupData ) => { 
        groupData = {...groupData, createdon: new Date().toLocaleDateString("de-DE"), id: uuid.v4().substring(0,8)}

        const docRef_group = doc(firestore, "groups", groupData.id);
        const docRef_user = doc(firestore, "users", user.username);

        try{
            await setDoc(docRef_group, {
                admin: groupData.admin,
                createdon: groupData.createdon,
                id: groupData.id,
                members: groupData.members,
                title: groupData.title
            });

            const snap = await getDoc(docRef_user);

            await updateDoc(docRef_user, {
                groups: [...snap.data().groups,groupData.id]
            });
        }
        catch(e){
            console.log("Error:", e)
        }
    }

    return (
    <>
        {showAccount ? <Account user={user} handleLogOut={handleLogOut} onexit={hideAccount} onShowDonation={() => {setShowDonation(true);hideAccount()}}/> : null}
        {showDonation ? <Donation onexit={() => {setShowAccount(true);hideDonation()}}></Donation> : null}
        {showCreateGroup ? <CreateGroup user={user} onCreate={createGroup} onexit={hideCreateGroup}></CreateGroup> : null}
        <Group show={showGroup} user={user} group={activeGroup} onExit={hideGroup}/>
        
        <Animated.View style={[{opacity: fadeAnim},styles.container]}>
            <View style={{height: 50}}></View>
            <View style={{alignItems: "center", flexDirection: "row"}}>                 
                <FontAwesome5 name="user-friends" style={{fontSize: 25, color: "#c4c4c4", marginLeft: 20}}/>
                <Text style={styles.heading}>Gruppen</Text>
                <Pressable onPress={() => {setShowMenu(true)}} style={({pressed}) => [{backgroundColor: pressed ? "#2b2b2b" : "#1E1E1E"},{position: "absolute", right: 15, padding: 15, borderRadius: 20}]}>
                    <Entypo  style={{color: "#c4c4c4", fontSize: 25}} name="dots-three-horizontal"/>
                </Pressable>
            </View>

            <View style={{height: 20}}></View>

            {loading ? 
            <View style={{justifyContent: "center", height: "75%"}}><ActivityIndicator size="large" color="#0080FF"/></View>
                 : 
                <>
                {groupList.length == 0 ? <Text style={{color: "#7d7d7d", fontFamily: "PoppinsLight", maxWidth: 200, textAlign: "center", alignSelf: "center", top: 30}}>Erstelle eine Gruppe oder tritt deinen Freuden bei!</Text> 
                : <>{groupList.map((group) =>
                <Pressable key={group.id} onPress={() => {setShowGroup(true); setActiveGroup(group)}}  style={({pressed}) => [{backgroundColor: pressed ? "#242424" : "#1E1E1E"}]}>
                    <View style={{width: "90%", padding: 20, alignSelf: "center", marginBottom: 0, borderTopColor: "#2b2b2b", borderTopWidth: 1}}>
                        <Text style={{fontFamily: "PoppinsBlack", color: "#c2c2c2", fontSize: 18}}>{chopTitle(group.title,25)}</Text>
                        <Text style={{fontFamily: "PoppinsLight", color: "#969696", fontSize: 15}}>{chopMembers(group.members)}</Text>
                    </View>
                </Pressable>
                    )}</>}
                </>
            }
            

            <View style={{height: 20}}></View>
            
            {showMenu ? <OptionPanel onShowCreate={() => setShowCreateGroup(true)} onexit={hideMenu}/> : null}

            <Pressable onPress={() => setShowAccount(true)} style={({pressed}) => [{backgroundColor: pressed ? "#333333" : "#2b2b2b"},styles.account_button]}>
                <View style={{ flexDirection: "row"}}>
                    <View style={{flex: 1}}>
                        <Image source={{uri: user.photoUrl}} style={{height: "100%", width: "100%"}}></Image>
                    </View>
                    <View style={{flex: 4, justifyContent: "center"}}>
                        <Text style={{left: 15, fontFamily: "PoppinsBlack", color: "#c4c4c4", fontSize: 18}}>{user.username}</Text>
                        <Text style={{left: 15, fontFamily: "PoppinsLight", color: "#999999"}}>Bong-Main</Text>
                    </View>
                </View>
            </Pressable>
          
        </Animated.View>
    </>
    );
}

export default Groups

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1E1E1E",
        height: "100%",
        width: "100%"
    },
    heading: {
        fontFamily: "PoppinsBlack",
        color: "#c4c4c4",
        fontSize: 20,
        marginLeft: 10
    },
    account_button: {
        width: "100%",
        height: 80,
        position: "absolute",
        bottom: 10,
    }
});