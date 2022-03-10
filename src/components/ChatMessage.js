import React, { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, Pressable } from 'react-native'
import ProfileImage from "./ProfileImage";

import { firestore } from "./FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const ChatMessage = ({ user, type, sender, img_uri, mood, onPress }) => {

    const [profileImage, setProfileImage] = useState(" ");

    useEffect(() => {
        getProfileImg(sender);
    },[]);

    const getProfileImg = async (username) => {
        try {
            const userRef = doc(firestore, "users", username);
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                setProfileImage(docSnap.data().photoUrl);
            }
        }
        catch(e){
            console.log("Error:", e)
        }
    }

    return (
        <>
            {type == "img" && sender != user.username ? 
                <Pressable style={({pressed}) => [{opacity: pressed ? 0.9 : 1},styles.container]} onPress={onPress}>
                    <View style={styles.header}>
                            <View style={{width: 5}}></View>
                            <ProfileImage x={25} type={1} url={profileImage}/>
                            <Text style={styles.sender_text}>{sender}</Text>
                    </View>
                    <View style={styles.footer}>
                        <View style={{position: "absolute", bottom: 0, width: "100%"}}>
                            <Text style={[styles.mood_text,{fontFamily: "PoppinsBlack", fontSize: 17, marginBottom: -8}]}>{mood}/10</Text>
                            <Text style={styles.mood_text}>Stimmung </Text>
                        </View>
                    </View>
                    
                    <Image style={styles.main_image} source={{uri: img_uri}}/>
                    
                </Pressable>
            : null}

            {type == "img" && sender == user.username ? 
                <Pressable style={({pressed}) => [{opacity: pressed ? 0.9 : 1},styles_self.container]} onPress={onPress}>
                    <View style={styles_self.header}>
                            <View style={{width: 5}}></View>
                            <ProfileImage x={25} type={1} url={user.photoUrl}/>
                            <Text style={styles_self.sender_text}>{sender}</Text>
                    </View>
                    <View style={styles_self.footer}>
                        <View style={{position: "absolute", bottom: 0, width: "100%"}}>
                            <Text style={[styles_self.mood_text,{fontFamily: "PoppinsBlack", fontSize: 17, marginBottom: -8}]}>{mood}/10</Text>
                            <Text style={styles_self.mood_text}>Stimmung </Text>
                        </View>
                    </View>
                    <Image style={styles_self.main_image} source={{uri: img_uri}}/>
                </Pressable>
            : null}
        </>
    );
}

export default ChatMessage

const styles = StyleSheet.create({
    container: {
        marginBottom: 25,
        marginLeft: 20,
        width: 138,
        height: 277,
        borderRadius: 20,
        borderTopLeftRadius: 0,
        borderColor: "#242424", 
        borderWidth: 4,
        overflow: "hidden"
    },
    main_image: {
        height: 237,
        width: 132,
        zIndex: 9
    },
    sender_text: {
        color: "white",
        fontFamily: "PoppinsLight",
        fontSize: 11,
        textAlignVertical: "center",
        marginLeft: 5
    },
    mood_text: {
        color: "white",
        fontFamily: "PoppinsLight",
        fontSize: 11,
        textAlign: "center",
    },
    header: {
        height: 35, 
        flexDirection: "row", 
        backgroundColor: "#242424", 
        borderTopRightRadius: 0, 
        alignItems: "center", 
        marginTop: -3
    },
    footer: {
        flexDirection: "column", 
        marginBottom: 3, 
        zIndex: 10, 
        position: "absolute", 
        height: 265, 
        width: 135
    }
    
});

const styles_self = StyleSheet.create({
    container: {
        marginBottom: 25,
        alignSelf: "flex-end",
        marginRight: 20,
        width: 138,
        height: 277,
        borderRadius: 20,
        borderTopRightRadius: 0,
        borderColor: "#4f4f4f", 
        borderWidth: 4,
        overflow: "hidden"
    },
    main_image: {
        height: 237,
        width: 132,
        zIndex: 9
    },
    sender_text: {
        color: "white",
        fontFamily: "PoppinsLight",
        fontSize: 11,
        textAlignVertical: "center",
        marginLeft: 5
    },
    mood_text: {
        color: "white",
        fontFamily: "PoppinsLight",
        fontSize: 11,
        textAlign: "center",
    },
    header: {
        height: 35, 
        flexDirection: "row", 
        backgroundColor: "#4f4f4f", 
        borderTopRightRadius: 0, 
        alignItems: "center", 
        marginTop: -3
    },
    footer: {
        flexDirection: "column", 
        marginBottom: 3, 
        zIndex: 10, 
        position: "absolute", 
        height: 265, 
        width: 135
    }
});
