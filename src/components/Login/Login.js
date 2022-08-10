import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import { useFonts } from "expo-font";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Button from "../../components/common/Button";
import { useEffect, useRef } from "react";

import Svg, { Circle, Line } from "react-native-svg";
import LoginNumber from "./LoginNumber/LoginNumber";
import LoginLine from "./LoginLine/LoginLine";

const Login = ({ handleLogin }) => {
  const icon = (
    <FontAwesome name="google" style={{ fontSize: 25, color: "black" }} />
  );

  const screen_width = Dimensions.get("screen").width;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

   /*  startLoginMovie(); */
  }, []);

  /* const [loaded] = useFonts({
    PoppinsBlack: require("./fonts/Poppins-Black.ttf"),
    PoppinsLight: require("./fonts/Poppins-Medium.ttf"),
  }); */

  if (!loaded) {
    return null;
  }

/*   const startLoginMovie = () => {

  } */

  return (
    <Animated.View style={[{ opacity: fadeAnim }, styles.login_container]}>

      <View style={{top: 0}}>
            <LoginNumber fontFamily={"PoppinsBlack"} color={"rgba(255,255,255,0.1)"} position={"absolute"}  top={295}   left={40} fontSize={35}     number={189} delay={1500}/>
            <LoginNumber fontFamily={"PoppinsBlack"} color={"rgba(255,255,255,0.15)"} position={"absolute"}  top={110}    left={280} fontSize={25}  number={132} delay={1000}/>
            <LoginNumber fontFamily={"PoppinsBlack"} color={"rgba(255,255,255,0.1)"} position={"absolute"}  top={70}    left={30} fontSize={20}     number={87} delay={500}/>
            <LoginNumber fontFamily={"PoppinsBlack"} color={"rgba(255,255,255,0.15)"} position={"absolute"} top={370}   left={330} fontSize={20}    number={233} delay={2000}/>
            <LoginNumber fontFamily={"PoppinsBlack"} color={"rgba(255,255,255,0.2)"} position={"absolute"}  top={455}   left={40} fontSize={18}     number={253} delay={2500}/>
            <LoginNumber fontFamily={"PoppinsBlack"} color={"rgba(255,255,255,0.2)"} position={"absolute"}  top={505}   left={320} fontSize={30}    number={311} delay={3000}/>
            <LoginNumber fontFamily={"PoppinsBlack"} color={"rgba(255,255,255,0.2)"} position={"absolute"}  top={540}   left={130} fontSize={20}    number={396} delay={3500}/>
      </View>

      <Svg height="100%" width="100%" style={{ position: "absolute"}}>

        <LoginLine x1={90}   y1={90}  x2={250}    y2={120}  stroke={"rgba(255,255,255,0.1)"}  strokeWidth={1} delay={500}/>
        <LoginLine x1={250}   y1={160}  x2={110}    y2={280}  stroke={"rgba(255,255,255,0.1)"}  strokeWidth={1} delay={1000}/>
        <LoginLine x1={125}   y1={325}  x2={300}    y2={375}  stroke={"rgba(255,255,255,0.15)"}  strokeWidth={1} delay={1500}/>
        <LoginLine x1={300}   y1={400}  x2={100}    y2={455}  stroke={"rgba(255,255,255,0.15)"}  strokeWidth={1} delay={2000}/>
        <LoginLine x1={110}   y1={485}  x2={295}    y2={515}  stroke={"rgba(255,255,255,0.2)"}  strokeWidth={1} delay={2500}/>
        <LoginLine x1={295}   y1={535}  x2={195}    y2={550}  stroke={"rgba(255,255,255,0.2)"}  strokeWidth={1} delay={3000}/>
        <LoginLine x1={180}   y1={585}  x2={195}    y2={600}  stroke={"rgba(255,255,255,0.2)"}  strokeWidth={1} delay={3500}/>

      </Svg>

      <View
        style={{
          width: "100%",
          height: 200,
          position: "absolute",
          top: 200,
          zIndex: 2
        }}
      >
        <View style={{flexDirection: "row", width: "90%", alignSelf: "center"}}>
            <View style={{flex: 1}}>
                <Image style={styles.image} source={require('../../data/img/joint.png')}/>
            </View>
            <View style={{flex: 1}}>
                <Image style={[styles.image,{width: 35, transform: [{translateY: -30}]}]} source={require('../../data/img/bong.png')}/>
            </View>
            <View style={{flex: 1}}>
                <Image style={[styles.image,{transform: [{translateY: -50}]}]} source={require('../../data/img/vape.png')}/>
            </View>
            <View style={{flex: 1}}>
                <Image style={[styles.image,{width: 40, transform: [{translateY: -30}]}]} source={require('../../data/img/pipe.png')}/>
            </View>
            <View style={{flex: 1}}>
                <Image style={[styles.image,{width: 55}]} source={require('../../data/img/cookie.png')}/>
            </View>
        </View>
        
        <Image
          style={{ height: 250, width: 250, alignSelf: "center", marginTop: -50}}
          source={require("../../data/img/logo.png")}
        />
        <Text
          style={{
            color: "white",
            fontSize: 40,
            fontFamily: "PoppinsBlack",
            textAlign: "center",
            marginTop: -30,
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
        <Text style={{fontFamily: "PoppinsBlack", color: "rgba(255,255,255,0.5)", textAlign: "center", fontSize: 40}}>420</Text>
        <Svg height="100%" width="100%" style={{ position: "absolute"}}>
          <Circle cx={screen_width / 2} cy={500} r={400} fill={"#0080FF"} />
        </Svg>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  login_container: {
    backgroundColor: "#1E2132",
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
