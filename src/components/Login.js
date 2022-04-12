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
import Button from "./Button";
import { useEffect, useRef } from "react";

import Svg, { Circle, Line } from "react-native-svg";
import LoginNumber from "./LoginNumber";

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

  const [loaded] = useFonts({
    PoppinsBlack: require("./fonts/Poppins-Black.ttf"),
    PoppinsLight: require("./fonts/Poppins-Medium.ttf"),
  });

  if (!loaded) {
    return null;
  }

/*   const startLoginMovie = () => {

  } */

  const lines = [
    {x1: 70,  y1: 45,  x2: 250,  y2: 70,  stroke: "rgba(255,255,255,0.1)",  strokeWidth: 1},
    {x1: 255,  y1: 100,  x2: 115,  y2: 215,  stroke: "rgba(255,255,255,0.1)",  strokeWidth: 1},
    {x1: 115,  y1: 245,  x2: 310,  y2: 305,  stroke: "rgba(255,255,255,0.1)",  strokeWidth: 1},
    {x1: 310,  y1: 320,  x2: 95,  y2: 355,  stroke: "rgba(255,255,255,0.1)",  strokeWidth: 1},
    {x1: 95,  y1: 370,  x2: 300,  y2: 430,  stroke: "rgba(255,255,255,0.1)",  strokeWidth: 1},
    {x1: 300,  y1: 450,  x2: 185,  y2: 475,  stroke: "rgba(255,255,255,0.1)",  strokeWidth: 1},
  ]

  return (
    <Animated.View style={[{ opacity: fadeAnim }, styles.login_container]}>

      <View style={{top: -50}}>
            <LoginNumber fontFamily={"PoppinsBlack"} color={"rgba(255,255,255,0.1)"} position={"absolute"}  top={340}   left={40} fontSize={35} number={189} />
            <LoginNumber fontFamily={"PoppinsBlack"} color={"rgba(255,255,255,0.15)"} position={"absolute"}  top={60}    left={280} fontSize={25}  number={132} />
            <LoginNumber fontFamily={"PoppinsBlack"} color={"rgba(255,255,255,0.1)"} position={"absolute"}  top={30}    left={30} fontSize={20}   number={87} />
            <LoginNumber fontFamily={"PoppinsBlack"} color={"rgba(255,255,255,0.15)"} position={"absolute"} top={300}   left={330} fontSize={20}  number={233} />
            <LoginNumber fontFamily={"PoppinsBlack"} color={"rgba(255,255,255,0.2)"} position={"absolute"}  top={350}   left={40} fontSize={18}   number={253} />
            <LoginNumber fontFamily={"PoppinsBlack"} color={"rgba(255,255,255,0.2)"} position={"absolute"}  top={370}   left={320} fontSize={30}  number={311} />
            <LoginNumber fontFamily={"PoppinsBlack"} color={"rgba(255,255,255,0.2)"} position={"absolute"}  top={360}   left={130} fontSize={20}  number={396} />
      </View>

      <Svg height="100%" width="100%" style={{ position: "absolute"}}>

      {lines.map(line => {
        <Line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke={line.stroke} strokeWidth={line.strokeWidth} />
      })}

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
        
        <Image
          style={{ height: 250, width: 250, alignSelf: "center", marginTop: -50}}
          source={require("./img/logo.png")}
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
