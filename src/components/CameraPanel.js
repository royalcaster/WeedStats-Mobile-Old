import React, {useEffect, useRef, useState} from "react";
import { Pressable, Text, View, StyleSheet, Animated, Easing, Dimensions  } from "react-native";
import { useFonts } from 'expo-font';

import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import { Camera, requestCameraPermissionsAsync } from "expo-camera";

const CameraPanel = ({ show, onExit }) => {

    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);

    const [loaded] = useFonts({
      PoppinsBlack: require('./fonts/Poppins-Black.ttf'),
      PoppinsLight: require('./fonts/Poppins-Light.ttf')
  });


    const windowWidth = Dimensions.get('window').width;

    var camera_height = windowWidth * 4 / 3;

    const slideAnim = useRef(new Animated.Value(windowWidth)).current;

    useEffect(() => {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }, []);

    if (hasPermission === null) {
      return <View />;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }

    show ? Animated.timing(
    slideAnim,
    {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.bezier(0,1.08,.99,1),
    }
  ).start() :
  Animated.timing(
    slideAnim,
    {
      toValue: windowWidth,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.bezier(0,1.08,.99,1),
    }
  ).start()  

    return (
        <Animated.View style={[{transform: [{translateX: slideAnim}]},styles.container]}>
            <Camera style={[{height: camera_height},styles.camera]} />
            
        <View>
          <Text style={{fontFamily: "PoppinsBlack", color: "#9c9c9c", position: "absolute", top: 20, left: 20}}>Wie ist die Stimmung bei dir?</Text>
        </View>

        <Pressable style={[{right: 35},styles.button]}><AntDesign style={styles.button_icon} name="retweet"/></Pressable>
        <Pressable style={[{alignSelf: "center"},styles.button_cam]}><FontAwesome style={styles.button_icon_cam} name="circle-thin"/></Pressable>
        <Pressable onPress={onExit} style={[{left: 35},styles.button]}><AntDesign style={styles.button_icon} name="left"/></Pressable>
        </Animated.View>
    );
}

export default CameraPanel

const styles = StyleSheet.create({
    container: {
      height: "100%",
      width: "100%",
      backgroundColor: "#171717",
      position: "absolute",
      zIndex: 9
    },
    camera: {
      width: "100%",
      top: 0
    },
    button: {
      position: "absolute",
      bottom: 45
    },
    button_icon: {
      color: "white",
      fontSize: 35
    },
    button_cam: {
      position: "absolute",
      bottom: 20
    },
    button_icon_cam: {
      color: "white",
      fontSize: 90
    }
});