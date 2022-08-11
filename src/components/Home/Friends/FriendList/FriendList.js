//React
import React, {useEffect, useRef, useState, memo, useContext} from "react";
import { Animated, View, StyleSheet, ScrollView } from "react-native";

//Custom Components
import Empty from "../../../common/Empty";
import FriendListItem from "./FriendListItem/FriendListItem";
import CustomLoader from "../../../common/CustomLoader";

//Third Party
import uuid from 'react-native-uuid'

//Firebase
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../../../data/FirebaseConfig";

//Service
import { UserContext } from "../../../../data/UserContext";


const FriendList = memo(({ setActiveFriend, setShowFriend}) => {

    const user = useContext(UserContext);

    const [friendList, setFriendList] = useState();
    const [loading, setLoading] = useState(true);

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