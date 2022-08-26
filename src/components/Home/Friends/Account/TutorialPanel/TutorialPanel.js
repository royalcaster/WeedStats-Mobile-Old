//React
import React, { useRef } from "react";
import { View, StyleSheet, Text, Animated, Easing, Dimensions } from "react-native";
import { responsiveHeight } from "react-native-responsive-dimensions";

//Custom Components
import BackButton from "../../../../common/BackButton";
import Tutorial from '../../../../common/Tutorial'


const TutorialPanel = ({ onexit }) => {

  const screen_width = Dimensions.get("window").width;
  const fadeAnim = useRef(new Animated.Value(screen_width)).current;

  /* const slide = () => {
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

  show ? slide() : hide();*/

  return (
    <Animated.View style={[{ opacity: 1}, styles.container]}>

        <View style={{position: "absolute" ,flexDirection: "row", alignContent: "center", alignItems: "center", width: "100%", top: 0, zIndex: 1000}}>
            <View style={{marginLeft: 10}}>
                <BackButton onPress={() => onexit()}/>
            </View>
            <Text style={styles.heading}>Tutorial</Text>
        </View>

    <View style={{position: "absolute", height: responsiveHeight(90), width: "100%", bottom: 0}}>
      <Tutorial onDone={() => onexit()}/>
    </View>

      </Animated.View>
  );
};

export default TutorialPanel;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: Dimensions.get("window").height,
    backgroundColor: "#1E2132",
    zIndex: 1,
    position: "absolute",
    bottom: 0,
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
