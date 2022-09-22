//React
import React, { useEffect, useRef, useContext } from "react";
import { Animated, Dimensions, StyleSheet, View, Text } from "react-native";

//Custom Components
import Button from "./Button";
import CustomLoader from "./CustomLoader";

//Service
import { LanguageContext } from "../../data/LanguageContext";

const CounterModal = ({ onExit, writeComplete, sayingNr }) => {

    const language = useContext(LanguageContext);

    const screen_height = Dimensions.get("screen").height;

    useEffect(() => {
    },[]);

    return (
        <View
            style={[styles.container, {
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
              flex: 1,
              height: screen_height
            }]}
          >
            <View
                style={{
                  width: "90%",
                  height: 300,
                  backgroundColor: "#1E2132",
                  alignSelf: "center",
                  borderRadius: 25,
                }}
              >
            {writeComplete ? (
              <>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.heading,
                      {
                        marginLeft: 0,
                        textAlign: "center",
                        height: "100%",
                        textAlignVertical: "center",
                        fontSize: 22,
                      },
                    ]}
                  >
                    {language.success}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.text, { fontSize: 15 }]}>
                    {language.sayings[sayingNr].saying}
                  </Text>
                  <Text
                    style={[
                      styles.text,
                      { fontSize: 15, fontStyle: "italic", marginTop: 10 },
                    ]}
                  >
                    {language.sayings[sayingNr].from}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    title={"Ok"}
                    color={"#0080FF"}
                    borderradius={25}
                    fontColor={"white"}
                    onPress={() => {
                      onExit();
                    }}
                    hovercolor={"rgba(255,255,255,0.3)"}
                  />
                </View></>
              
            ) : (
              <View style={{height: "100%", width: "100%", justifyContent: "center"}}>
              <CustomLoader x={50} color={"#0080ff"}/></View>
            )}
            </View>
          </View>
    );
}

export default CounterModal

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E2132",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#1E2132",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 20,
  },
  modalBigText: {
    textAlign: "center",
    color: "white",
    fontFamily: "PoppinsBlack",
    fontSize: 45,
    paddingBottom: 20,
  },
  modalSmallText: {
    textAlign: "center",
    color: "white",
    fontFamily: "PoppinsLight",
    fontSize: 18,
    marginBottom: 30,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontFamily: "PoppinsBlack",
    fontSize: 30,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  heading: {
    color: "white",
    fontSize: 20,
    fontFamily: "PoppinsBlack",
    marginLeft: 20,
  },
  text: {
    alignSelf: "center",
    fontFamily: "PoppinsLight",
    fontSize: 18,
    color: "white",
    maxWidth: 250,
    textAlign: "center",
  },
});
