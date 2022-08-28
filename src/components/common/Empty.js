//React
import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Text, Animated, Easing } from "react-native";

//Third Party
import { responsiveFontSize } from 'react-native-responsive-dimensions'

const Empty = ({ title, tip }) => {

  const fadeAnim = useRef(new Animated.Value(100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.bezier(0, 1.02, 0.21, 0.97),
    }).start();
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ alignItems: "center", width: "90%", alignSelf: "center", transform: [{translateY: fadeAnim}], opacity: opacityAnim}}>
        <View style={{flexDirection: "row"}}>
          <Text style={styles.heading}>{title}</Text>
          <Text style={styles.smile}>:{"("}</Text>
        </View>
        <View style={{ height: 30 }}></View>
        <Text style={styles.heading2}>
          {tip}
        </Text>
      </Animated.View>
    </View>
  );
};

export default Empty;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    justifyContent: "center"
  },
  heading: {
    fontFamily: "PoppinsBlack",
    textAlign: "left",
    color: "#484F78",
    fontSize: 30,
    width: "50%"
  },
  heading2: {
    fontFamily: "PoppinsLight",
    textAlign: "center",
    color: "#484F78",
    fontSize: responsiveFontSize(1.5)
  },
  smile: {
    fontSize: responsiveFontSize(14),
    color: "#484F78"
  }
});
