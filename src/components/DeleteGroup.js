import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text, Animated, Easing, Dimensions, TextInput } from "react-native";
import Button from "./Button";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const DeleteGroup = ( { onExit, group, onDelete } ) => {

    const windowHeight = Dimensions.get('window').height;
    const slideAnim = useRef(new Animated.Value(windowHeight)).current;

    const [confirmed, setConfirmed] = useState(false);

    const deleteIcon = <MaterialCommunityIcons style={styles.icon} name="delete"/>;

    useEffect(() => {
        Animated.timing(slideAnim,{
            useNativeDriver: true,
            toValue: 0,
            duration: 400,
            easing: Easing.bezier(0,1.02,.21,.97),
        }).start();
    },[]);

    return (
        <Animated.View style={[{transform: [{translateY: slideAnim}], height: windowHeight + 30},styles.container]}> 
            <View style={{height: 50}}></View>

            <View style={{alignItems: "center", flexDirection: "row"}}>       
                <View style={{width: 20}}></View>          
                <Text style={styles.heading}>{deleteIcon} Gruppe löschen</Text>
            </View>
            
            <View>
                <View style={{height: 50}}></View>   
                <Text style={styles.text}>Tippe <Text style={[styles.text,{color: "#0080FF", fontSize: 20, fontFamily: "PoppinsBlack"}]}>{group.title}</Text> ein, um das Löschen der Gruppe zu bestätigen.</Text>
                <View style={{height: 20}}></View> 
                <TextInput spellCheck={false} selectionColor={"white"} style={[styles.input, {borderColor: confirmed ? "#3BA426" : "#eb4034", borderWidth: 2}]} onChangeText={(text) => {
                    if (text == group.title) {
                        setConfirmed(true);
                    }
                    else {
                        setConfirmed(false);
                    }
                }}/>

            </View>

            <View style={{height: 50}}></View> 

            <View style={{width: "100%"}}>
                {confirmed ? <Button onPress={() => onDelete(group.id)} icon={deleteIcon} title={"Gruppe löschen"} borderradius={100} color={"#eb4034"} /* onPress={} */ fontColor={"white"}/> : null}
                <View style={{height: 20}}></View>
                <Button title={"Abbrechen"} borderradius={100} color={"rgba(255,255,255,0.25)"} onPress={onExit} fontColor={"white"}/>
            </View>

        </Animated.View>
    );
}

export default DeleteGroup

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "#1E1E1E",
        top: 0,
        position: "absolute",
        zIndex: 3
    }, 
    heading: {
        fontFamily: "PoppinsBlack",
        color: "white",
        fontSize: 20,
        marginLeft: 10
    },
    icon: {
        color: "white",
        fontSize: 25,
        textAlignVertical: "center",
        flex: 1,
        textAlign: "center",
        zIndex: 1
    },
    input: {
        backgroundColor: "#171717",
        height: 60,
        width: "80%",
        alignSelf: "center",
        borderRadius: 100,
        color: "white",
        fontFamily: "PoppinsBlack",
        fontSize: 25,
        textAlign: "center",
    },
    text: {
        color: "white",
        maxWidth: 300,
        alignSelf: "center",
        fontFamily: "PoppinsLight",
        fontSize: 16
    }
});