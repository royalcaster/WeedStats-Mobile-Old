import React from "react";
import {
  ImageBackgroundBase,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
  Pressable,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { useFonts } from "expo-font";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Button from "./Button";
import { useEffect, useRef } from "react";

import Svg, { Circle } from "react-native-svg";

const Login = ({ handleLogin }) => {
  const icon = (
    <FontAwesome name="google" style={{ fontSize: 25, color: "black" }} />
  );

  const screen_width = Dimensions.get("screen").width;
  const screen_height = Dimensions.get("screen").height;

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const [loaded] = useFonts({
    PoppinsBlack: require("./fonts/Poppins-Black.ttf"),
    PoppinsLight: require("./fonts/Poppins-Medium.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <Animated.View style={[{ opacity: fadeAnim }, styles.login_container]}>
      <View style={{ height: 50 }}></View>

        <View style={{zIndex: -1, flex: 1}}>
            <Text style={{fontFamily: "PoppinsBlack", color: "rgba(255,255,255,0.1)", position: "absolute", top: 30, left: 30, fontSize: 20}}>243</Text>
            <Text style={{fontFamily: "PoppinsBlack", color: "rgba(255,255,255,0.2)", position: "absolute", top: 210, left: 70, fontSize: 35}}>189</Text>
            <Text style={{fontFamily: "PoppinsBlack", color: "rgba(255,255,255,0.2)", position: "absolute", top: 80, left: 240, fontSize: 25}}>87</Text>
            <Text style={{fontFamily: "PoppinsBlack", color: "rgba(255,255,255,0.2)", position: "absolute", top: 300, left: 300, fontSize: 20}}>396</Text>    
        </View>

      <View
        style={{
          width: "100%",
          height: 200,
          position: "absolute",
          top: 200,
          zIndex: 2
        }}
      >
        <View style={{flexDirection: "row"}}>
            <View style={{flex: 1}}>
                <Image style={styles.image} source={require('./img/joint.png')}/>
            </View>
            <View style={{flex: 1}}>
                <Image style={[styles.image,{width: 35, transform: [{translateY: -30}]}]} source={require('./img/bong.png')}/>
            </View>
            <View style={{flex: 1}}>
                <Image style={[styles.image,{transform: [{translateY: -50}]}]} source={require('./img/vape.png')}/>
            </View>
            <View style={{flex: 1}}>
                <Image style={[styles.image,{width: 40, transform: [{translateY: -30}]}]} source={require('./img/pipe.png')}/>
            </View>
            <View style={{flex: 1}}>
                <Image style={[styles.image,{width: 55}]} source={require('./img/cookie.png')}/>
            </View>
        </View>
        

        <View style={{ height: 0 }}></View>
        <Image
          style={{ height: 200, width: 200, alignSelf: "center" }}
          source={require("./img/logo.png")}
        />
        <Text
          style={{
            color: "white",
            fontSize: 30,
            fontFamily: "PoppinsBlack",
            textAlign: "center",
            marginTop: -15,
          }}
        >
          WeedStats
        </Text>
      </View>

      <View
        style={{ zIndex: 2, position: "absolute", bottom: 0, width: "100%" }}
      >
        <Button
          fontColor={"black"}
          icon={icon}
          title={" Mit Google Anmelden"}
          borderradius={100}
          color={"white"}
          onPress={handleLogin}
          hovercolor={"rgba(0,0,0,0.15)"}
        />
        <View style={{ height: 40 }}></View>
      </View>

      <View
        style={{
          position: "absolute",
          height: 250,
          width: "100%",
          bottom: 0,
          zIndex: 1,
        }}
      >
        <Svg height="100%" width="100%" style={{ position: "absolute" }}>
          <Circle cx={screen_width / 2} cy={500} r={400} fill={"#0080FF"} />
        </Svg>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  login_container: {
    backgroundColor: "#1E1E1E",
    height: "100%",
  },
  login_heading: {
    color: "#1E1E1E",
    fontSize: 25,
    fontFamily: "PoppinsBlack",
    textAlign: "center",
    textAlignVertical: "center",
    marginTop: 10,
  },
  login_pressable: {
    borderWidth: 2,
    borderRadius: 100,
    width: 300,
    height: 60,
    justifyContent: "center",
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    overflow: "hidden",
  },
  login_pressable_text: {
    color: "white",
    alignSelf: "center",
    fontFamily: "PoppinsLight",
    fontSize: 18,
    color: "#1E1E1E",
  },
  login_logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
  },
  info_container: {
    width: "85%",
    flex: 4,
    backgroundColor: "#1E1E1E",
    alignSelf: "center",
    borderRadius: 20,
  },
  info_icon: {
    color: "white",
    alignSelf: "center",
    fontSize: 70,
  },
  text: {
    color: "white",
    fontFamily: "PoppinsLight",
    width: "85%",
    alignSelf: "center",
    textAlign: "center",
    fontSize: 15,
  },
  image: {
      height: 60,
      width: 20,
      alignSelf: "center"
  }
});

export default Login;
