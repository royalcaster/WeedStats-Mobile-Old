//React
import React, { useEffect, useRef, useContext } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

//Custom Components
import Button from "./Button";
import CustomLoader from "./CustomLoader";

//Service
import { LanguageContext } from "../../data/LanguageContext";

const CounterModal = ({ onExit, writeComplete }) => {

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
                      setModalVisible(!modalVisible);
                      setWriteComplete(false);
                    }}
                    hovercolor={"rgba(255,255,255,0.3)"}
                  />
                </View></>
              
            ) : (
              <View style={{height: "100%", width: "100%", justifyContent: "center"}}>
              <CustomLoader x={80}/></View>
            )}
            </View>
          </View>
    );
}

export default CounterModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "green"
    }
});
