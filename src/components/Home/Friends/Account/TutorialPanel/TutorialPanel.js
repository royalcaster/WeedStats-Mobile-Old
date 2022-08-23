//React
import React, { useRef } from "react";
import { View, StyleSheet, Text, Animated, Easing, Dimensions } from "react-native";

//Custom Components
import BackButton from "../../../../common/BackButton";
import Tutorial from '../../../../common/Tutorial'


const TutorialPanel = ({ onexit, show }) => {

  const screen_width = Dimensions.get("window").width;
  const fadeAnim = useRef(new Animated.Value(screen_width)).current;

  const slide = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.bezier(0,.79,0,.99),
      useNativeDriver: true,
    }).start();
  }

  const hide = () => {
    Animated.timing(fadeAnim, {
      toValue: screen_width,
      duration: 300,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        onexit();
      }
    });
  };

  show ? slide() : hide();

  return (
    <Animated.View style={[{ opacity: 1 , transform: [{translateX: fadeAnim}]}, styles.container]}>

        <View style={{flexDirection: "row", alignContent: "center", alignItems: "center", position: "absolute", width: "100%", top: 0, zIndex: 1000}}>
            <View style={{marginLeft: 20}}>
                <BackButton onPress={() => hide()}/>
            </View>
            <Text style={styles.heading}>Tutorial</Text>
        </View>

      <View style={{ height: 10 }}></View>

    <View style={{position: "absolute", height: "82%", width: "100%", bottom: 40}}>
      <Tutorial onDone={() => hide()}/>
    </View>

      </Animated.View>
  );
};

export default TutorialPanel;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#131520",
    zIndex: 1,
    position: "absolute",
    bottom: 0,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25
  },
  heading: {
    color: "white",
    fontSize: 20,
    fontFamily: "PoppinsBlack",
    marginLeft: 20,
    textAlign: "left",
    marginTop: 5
  },
});
