import React from "react";
import { useState, useRef, useEffect } from "react";
import {View, Pressable, StyleSheet, Text, Animated, Easing, TouchableNativeFeedback } from 'react-native'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const  GroupListItem = ({ onPress, group, username }) => {

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(-40)).current;

    const [news, setNews] = useState(0);

    const [rippleColor, setRippleColor] = useState("rgba(255,255,255,0.15)");
    const [rippleOverflow, setRippleOverflow] = useState(false);

    useEffect(() => {
        Animated.timing(
          fadeAnim,
          {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }
        ).start();
        Animated.timing(
            slideAnim,
            {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
              easing: Easing.bezier(0,1.02,.21,.97),
            }
          ).start();
      }, [])

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

    const getNews = () => {
        
        var n;
        group.members.forEach((member) => {
            if (member.name == username) {
                n = member.latestonline;
            }
        });

        if (group.messages.length - n > 0) {
            
            return <View style={{justifyContent: "center"}}>
                        <Text style={styles.news_text}>{group.messages.length - n}</Text>
                    </View>
            ;
        }
    }

    const getLastMessageLine = () => {
        var result1;
        var length = group.messages.length
        result1 = group.messages[length - 1].sender + ": ";

        var result2;
        switch(group.messages[length - 1].type) {
            case "img": result2 = "Bild"; break;
        }

        return <View style={{alignContent: "center"}}><Text style={{fontFamily: "PoppinsLight", color: "#969696", fontSize: 12}}>{result1}<MaterialCommunityIcons style={{fontSize: 13, position: "relative", transform: [{scale: 1.2}]}} name="folder-image"/> {result2}</Text></View>;
    }


    return (
        <Animated.View style={[{opacity: fadeAnim, transform: [{translateX: slideAnim}]}, styles.container]}>
            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple(rippleColor, rippleOverflow)} onPress={onPress}  style={({pressed}) => [{backgroundColor: pressed ? "#242424" : "#1E1E1E", flexDirection:"row"}]}>
                <View style={styles.touchable}>
                    <View style={{flexDirection: "row"}}>
                        <View style={{width: "80%", alignSelf: "center", marginBottom: 0, borderTopColor: "#2b2b2b", borderTopWidth: 0}}>
                            <Text style={{fontFamily: "PoppinsMedium", color: "rgba(255,255,255,0.85)", fontSize: 18, marginBottom: -4}}>{chopTitle(group.title,25)}</Text>
                        {getLastMessageLine()}
                        </View>
                        <View style={{flexDirection: "column"}}>
                            <Text style={[{color: "#969696"},styles.date]}>{group.messages[group.messages.length - 1].date.time.substring(0,5)}</Text>
                            <View style={{height: 5}}></View>
                            {getNews()}
                        </View>
                    </View>
                </View>
            </TouchableNativeFeedback>
        </Animated.View>
    )
}

export default GroupListItem

const styles = StyleSheet.create({
    container: {
    },
    news_text: {
        color: "#171717",
        textAlignVertical: "center",
        textAlign: "center",
        height: 22,
        width: 22,
        borderRadius: 25,
        backgroundColor: "#0080FF",
        fontSize: 12,
        fontFamily: "PoppinsMedium",
        paddingTop: 2,
        alignSelf: "center"
    },
    date: {
        color: "#969696",
        fontSize: 12,
        textAlignVertical: "center"
    },
    touchable: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor: "#171717",
        height: 80
      }
});