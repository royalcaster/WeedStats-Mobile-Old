import React, {useEffect, useRef, useState} from "react";
import { Pressable, Text, View, StyleSheet, Animated, Easing, Dimensions, Image, ActivityIndicator  } from "react-native";
import { useFonts } from 'expo-font';

import {Slider} from '@miblanchard/react-native-slider';

import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import { Camera, requestCameraPermissionsAsync } from "expo-camera";

const CameraPanel = ({ show, onExit, group, onSend, status }) => {

    const [mood, setMood] = useState(5);

    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const ref = useRef(null)
    const [picTaken, setPicTaken] = useState(false);
    const [previewPic, setPreviewPic] = useState(null);

    const [loaded] = useFonts({
      PoppinsBlack: require('./fonts/Poppins-Black.ttf'),
      PoppinsLight: require('./fonts/Poppins-Light.ttf')
    });

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    var camera_height = windowWidth * 16 / 9;

    const slideAnim = useRef(new Animated.Value(windowWidth)).current;

    useEffect(() => {
      (async () => {
        const { status } = await requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();

      Animated.timing(
        slideAnim,
        {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.bezier(0,1.02,.21,.97),
        }
      ).start()
    }, []);

    if (hasPermission === null) {
      return <View />;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }

  const takePicture = async () => {
    const pic = await ref.current.takePictureAsync({
      quality: 0.5
    });
    setPicTaken(true);
    setPreviewPic(pic);
    return pic;
  }

  const sendPic = () => {
    onSend(previewPic.uri, mood);
    onExit();
    setPreviewPic(null);
    setPicTaken(false);
  }

    return (
        <Animated.View style={[{transform: [{translateX: slideAnim}]},styles.container]}>

        {status ? <View style={styles.loading_container}>
                    <ActivityIndicator size={"large"} color={"#0080FF"}></ActivityIndicator>
                  </View>
        : null}

        {picTaken && previewPic ? 
        <>
        <Image style={[{height: camera_height},styles.preview_image]} source={{uri: previewPic && previewPic.uri}} />

        <View style={styles.camera_options}>
          <View style={{flex: 1}}>
            <Pressable onPress={() => {
              setPicTaken(false);
              setPreviewPic(null);
            }} style={({pressed}) => [{transform: [{scale: pressed ? 0.85 : 1}]},styles.send_button]}>
              <FontAwesome name="remove" style={styles.send_icon}/>
            </Pressable>
          </View>
          <View style={{flex: 1}}>
            <Pressable onPress={() => sendPic()} style={({pressed}) => [{transform: [{scale: pressed ? 0.85 : 1}]},styles.send_button]}>
              <FontAwesome name="send" style={styles.send_icon}/>
            </Pressable>
          </View>
        </View>

        <View style={{bottom: windowHeight - camera_height + 35}}>
          <View style={{flexDirection: "row", width: "100%", paddingTop: 30}}>
            <Text style={styles.label}>Wie ist die Stimmung bei dir?</Text>
            <Text style={styles.mood}>{mood}/10</Text>
          </View>
          <View style={{width: "80%", alignSelf: "center"}}>
            <Slider style={styles.slider} maximumValue={10} value={mood} onValueChange={value => setMood(value)} step={1}/>
          </View>

        </View>
        </>
        : 
        <>
        <Camera style={[{height: camera_height},styles.camera]} type={type} ratio="16:9" ref={ref}>
          <Text style={[styles.group_title,{fontFamily: "PoppinsLight", fontSize: 15}]}>senden an:</Text>
          <Text style={styles.group_title}>{group.title}</Text>
        </Camera>
        <View style={{position: "absolute", bottom: 0, width: "100%"}}>
          <Pressable onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }} style={({pressed}) => [{right: 35, transform: [{scale: pressed ? 0.8 : 1}]},styles.button]}>
            <AntDesign style={styles.button_icon} name="retweet"/>
          </Pressable>
          <Pressable onPress={() => takePicture()} style={({pressed}) =>  [{alignSelf: "center", transform: [{scale: pressed ? 0.95 : 1}] },styles.button_cam]}>
            <FontAwesome style={styles.button_icon_cam} name="circle-thin"/>
          </Pressable>
          <Pressable onPress={onExit} style={({pressed}) => [{left: 35, transform: [{scale: pressed ? 0.8 : 1}]},styles.button]}>
            <AntDesign style={styles.button_icon} name="left"/>
          </Pressable>
        </View>
        </>
        } 
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
      zIndex: 20,
      top: 0
    },
    camera: {
      width: "100%",
      top: 0
    },
    button: {
      position: "absolute",
      bottom: 5,
      padding: 20
    },
    button_icon: {
      color: "white",
      fontSize: 35
    },
    button_cam: {
      position: "absolute",
      bottom: 10
    },
    button_icon_cam: {
      color: "white",
      fontSize: 70
    },
    slider: {
      position: "relative",
      width: "90%"
    },
    preview_image: {
      width: "100%",
      top: 0
    },
    group_title: {
      color: "white",
      fontFamily: "PoppinsBlack",
      fontSize: 25,
      textAlign: "center",
      top: 50
    },
    send_button: {
      paddingTop: 10,
      paddingBottom: 10
    },
    send_icon: {
      color: "white",
      fontSize: 35,
      textAlign: "center"
    },
    loading_container: {
      zIndex: 19, 
      position: "absolute", 
      width: "100%", 
      height: "100%", 
      justifyContent: "center"
    },
    camera_options: {
      flexDirection: "row", 
      position: "relative", 
      top: 15
    },
    label: {
      fontFamily: "PoppinsBlack", 
      color: "white", 
      left: 20, 
      fontSize: 18
    },
    mood: {
      fontFamily: "PoppinsBlack", 
      color: "white", 
      position: "absolute", 
      top: 15, 
      right: 20, 
      fontSize: 40
    }
});