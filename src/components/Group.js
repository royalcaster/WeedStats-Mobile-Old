import React, { useEffect } from "react";
import { Pressable, View, Text, StyleSheet, ScrollView, Animated, Dimensions, StatusBar, Easing, Image, FlatList, TouchableNativeFeedback,Modal } from "react-native";
import { useState, useRef } from "react";

import app from '@react-native-firebase/app'
import storage, { firebase } from '@react-native-firebase/storage'
import uuid from 'react-native-uuid'

import { getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";

import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { RecyclerListView } from "recyclerlistview";

import BigPicture from "./BigPicture";

import MemberList from "./MemberList";

import { useFonts } from 'expo-font';
import CameraPanel from "./CameraPanel";
import { db } from "./FirebaseConfig";
import { onValue, update, ref as reff, set, onChildAdded } from "firebase/database";
import DeleteGroup from "./DeleteGroup";

import ChatMessage from "./ChatMessage";

const Group = ({show, user, group, onExit, onRefresh, onDelete, refresh }) => {

    const [showCamera, setShowCamera] = useState(false);
    const windowWidth = Dimensions.get('window').width;
    const [showMemberList, setShowMemberList] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [loaded] = useFonts({
        PoppinsBlack: require('./fonts/Poppins-Black.ttf'),
        PoppinsLight: require('./fonts/Poppins-Light.ttf')
    });

    const [rippleColor, setRippleColor] = useState("rgba(255,255,255,0.15)");
    const [rippleOverflow, setRippleOverflow] = useState(false);

    const [deleteVisible, setDeleteVisible] = useState(false);

    const screenHeight = Dimensions.get('screen').height;
    const windowHeight = Dimensions.get('window').height;
    const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;

    const [bigPicture, setBigPicture] = useState({
        date: {
            day: " ",
            time: " "
        },
        download_uri: " ",
        sender: " ",
        mood: " ",
        img_id: " "
    });
    const [showBigPicture, setShowBigPicture] = useState(false);

    const [messages, setMessages] = useState("");

    useEffect(() => {
        setMessages(getMessageList(group.id));
        console.log(group.id);

        Animated.timing(
            slideAnim,
            {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
              easing: Easing.bezier(0,1.02,.21,.97),
            }
          ).start();
          if (user.username == group.admin) {
            setUserIsAdmin(true);
        }
    },[]);

    const slideAnim = useRef(new Animated.Value(windowWidth)).current;

    const [userIsAdmin, setUserIsAdmin] = useState(false);

    const scrollRef = useRef(null);

   /*  useEffect(() => {
        scrollRef.current.scrollToEnd({ animated: false });
    },[messages]); */

    const chopTitle = (title, n) => {
        if (title.length > n) {
            return title.substring(0,n) + " ...";
        }
        else {
            return title;
        }
    }

    const chopMembers = (members) => {

        if (members.length == 1) {
            return members[0].name
        }

        let result = members[0].name;

        for (var i = 1; i<members.length; i++) {
            result = result +  ", " + members[i].name
        }

        return chopTitle(result, 50);
    }

    const hideMemberList = () => {
        setShowMemberList(false);
    }

const uploadImageAsync = async (uri, mood) => {
    try {
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", uri, true);
          xhr.send(null);
        });
      
        var img_id = uuid.v4();
        const fileRef = ref(getStorage(), img_id);
        const result = await uploadBytes(fileRef, blob);
        blob.close(); //Upload fertig
      
        const url = await getDownloadURL(fileRef);

        var date = new Date();
        var id = uuid.v4();

        var counter;
        const counterRef = reff(db, "groups/" + group.id + "/counter");
        onValue(counterRef,(snapshot)=>{counter = snapshot.val()});
    
        const messageRef = reff(db, "groups/" + group.id + "/messages/" + (counter + 1));
        set(messageRef,{
            type: "img",
            sender: user.username,
            download_uri: url,
            img_id: img_id,
            mood: mood,
            date: {
                day: date.toDateString(),
                time: date.toTimeString()
            }
        });

        set(counterRef,counter + 1);
    }
    catch(e) {
        console.log("lul", e);
    }
    onRefresh();
    setMessages(getMessageList(group.id));
}

const data = [{
    img_id: 1,
    sender: "etst"
},
{
    img_id: 2,
    sender: "asdadasd"
}
]

const getMessageList = (group) => {
    var messages_buffer = [];
    const messageRef = reff(db, "groups/" + group + "/messages");
    onChildAdded(messageRef, (snapshot) => {
        messages_buffer.push({
            type: snapshot.val().type,
            date: snapshot.val().date,
            sender: snapshot.val().sender,
            download_uri: snapshot.val().download_uri,
            mood: snapshot.val().mood,
            img_id: snapshot.val().img_id
        });
    });
    return messages_buffer;
    console.log(group);
}

const hide = () => {
    Animated.timing(slideAnim, {
        toValue: windowWidth,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.bezier(0,1.02,.21,.97),
    }).start(({finished}) => {
        if (finished) {onExit()};
    });
}

const renderItem = ({ item }) => {
   return <ChatMessage user={user} type={item.type} sender={item.sender} img_uri={item.download_uri} mood={item.mood} onPress={() => {setBigPicture(item); setShowBigPicture(true)}}/>
}

    return (
        <Animated.View style={[{transform: [{translateX: slideAnim}], height: screenHeight - (screenHeight - windowHeight) + StatusBar.currentHeight},styles.container]}>

            <BigPicture user={user} message={bigPicture} show={showBigPicture} onExit={() => setShowBigPicture(false)}/>

            <View style={{height: 40}}></View>

            <MemberList show={showMemberList} members={group.members} onHide={hideMemberList}/>

            <View style={{flexDirection: "row", width: "100%", zIndex: 1, backgroundColor: "#1E1E1E"}}>

            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(rippleColor, true)} onPress={() => {refresh; hide()}}>
                <View style={styles.touchable}>
                    <Ionicons name="chevron-back" style={styles.icon}/>
                </View>
            </TouchableNativeFeedback>
            
            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(rippleColor, rippleOverflow)} onPress={() => setShowMemberList(true)}>
                <View style={[styles.touchable,{flex: 4, height: 70}]}>
                    <View style={{width: "100%", padding: 15}}>
                        <Text style={styles.heading}>{chopTitle(group.title, 20)}</Text>
                        <Text style={styles.members}>{chopMembers(group.members)}</Text>
                    </View>
                </View>
            </TouchableNativeFeedback>

                {group.admin == user.username ? <>
                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(rippleColor, rippleOverflow)} onPress={onExit}>
                        <View style={styles.touchable}>
                            <AntDesign style={styles.icon} name="adduser"/>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(rippleColor, rippleOverflow)} onPress={() => setDeleteVisible(true)}>
                        <View style={styles.touchable}>
                            <MaterialCommunityIcons style={styles.icon} name="delete"/>
                        </View>
                    </TouchableNativeFeedback>
                    </>
                    : 
                    <View style={{flex: 2}}></View>}
                
            </View>

            <View style={styles.content}>
                
             {/* {
                 messages ? <FlatList
                 ref={scrollRef}
                 data={messages}
                 renderItem={renderItem}
                 keyExtractor={(item) => item.img_id}
                 onContentSizeChange={() => scrollRef.current.scrollToEnd({ animated: false })}
             /> : null
             } */}  

             {
                 messages ? <RecyclerListView 
                    
                 /> : null
             } 

             
            
            </View>
             {showCamera ? <CameraPanel show={showCamera} onExit={() => setShowCamera(false)} group={group} onSend={uploadImageAsync} status={uploadingImage}/> : null}
            
            {deleteVisible ?
                <DeleteGroup onExit={() => setDeleteVisible(false)} group={group} onDelete={onDelete}/>
            : null}

            <View style={{position: "absolute", zIndex: 0, height: "100%", width: "100%", backgroundColor: "#171717", justifyContent: "center"}}>
                <Image source={require('./img/logo_bw.png')} style={styles.background_img}/>
            </View>
            <Pressable onPress={() => setShowCamera(true)} style={({pressed}) => [{backgroundColor: pressed ? "#0072e3" : "#0080FF"},styles.add_button]}>
                <MaterialIcons style={styles.camera} name="camera" />
            </Pressable>

        </Animated.View>
    );
}

export default Group

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: "100%",
        zIndex: 20,
        marginTop: 0,
    },
    header: {
        flex: 4, 
        paddingTop: 10, 
        paddingBottom: 10,
        zIndex: 1
    },
    heading: {
        color: "white",
        fontFamily: "PoppinsBlack",
        fontSize: 20,

    },
    members: {
        color: "white",
        fontFamily: "PoppinsLight",
        fontSize: 11,
        marginTop: -5
    },
    icon: {
        color: "white",
        fontSize: 25,
        textAlignVertical: "center",
        flex: 1,
        textAlign: "center",
        zIndex: 1
    },
    content: {
        flex: 1,
        zIndex: 1,
        paddingTop: 0
    },
    add_button: {
        borderRadius: 100,
        width: 70,
        height: 70,
        justifyContent: "center",
        alignSelf: "flex-end",
        zIndex: 2,
        position: "absolute",
        bottom: 20,
        right: 20
    },
    camera: {
        color: "white",
        fontSize: 40,
        textAlign: "center"
    },
    background_img: {
        height: 150,
        width: 150,
        alignSelf: "center"
    },
    camera_container: {
        height: "70%",
        width: "100%",
        zIndex: 20,
        top: 110,
        position: "absolute"
    },
    touchable: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor: "#1E1E1E",
        flex: 1
      }
});