import React, { useState } from "react";
import { StyleSheet, View, Pressable, Image, Text } from "react-native";
import { useFonts } from "expo-font";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const ConfigItem = ({ type, config, onToggle }) => {
  /* const [test, setType] = useState(configtype); */

  const [active, setActive] = useState(config);

  const [loaded] = useFonts({
    PoppinsBlack: require("./fonts/Poppins-Black.ttf"),
    PoppinsLight: require("./fonts/Poppins-Light.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <Pressable
      onPress={() => {
        onToggle(type);
        setActive(!active);
      }}
      style={{
        flex: 1
      }}
    >
      <View style={active ? styles.container_active : styles.container}>
        <MaterialIcons
          name={active ? "check-box" : "check-box-outline-blank"}
          style={active ? styles.checkbox_active : styles.checkbox}
        ></MaterialIcons>
        {type === "joint" ? (
          <>
            <Image
              style={active ? styles.joint_img_active : styles.joint_img}
              source={require("./img/joint.png")}
            ></Image>
            <Text style={active ? styles.label_active : styles.label}>
              Joint
            </Text>
          </>
        ) : null}
        {type === "bong" ? (
          <>
            <Image
              style={active ? styles.bong_img_active : styles.bong_img}
              source={require("./img/bong.png")}
            ></Image>
            <Text style={active ? styles.label_active : styles.label}>
              Bong
            </Text>
          </>
        ) : null}
        {type === "vape" ? (
          <>
            <Image
              style={active ? styles.vape_img_active : styles.vape_img}
              source={require("./img/vape.png")}
            ></Image>
            <Text style={active ? styles.label_active : styles.label}>
              Vape
            </Text>
          </>
        ) : null}
      </View>
    </Pressable>
  );
};

export default ConfigItem;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    margin: 10,
    marginBottom: 30,
    borderRadius: 25,
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "#171717",
  },
  container_active: {
    paddingTop: 10,
    margin: 10,
    marginBottom: 30,
    borderRadius: 25,
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "#171717",

    borderColor: "#0781E1",
    borderWidth: 3,
  },
  bong_img: {
    height: 80,
    width: 45,
    alignSelf: "center",
    opacity: 0.5,
  },
  bong_img_active: {
    height: 80,
    width: 45,
    alignSelf: "center",
  },
  joint_img: {
    height: 80,
    width: 30,
    alignSelf: "center",
    opacity: 0.5,
  },
  joint_img_active: {
    height: 80,
    width: 30,
    alignSelf: "center",
  },
  vape_img: {
    height: 80,
    width: 45,
    alignSelf: "center",
    opacity: 0.5,
  },
  vape_img_active: {
    height: 80,
    width: 45,
    alignSelf: "center",
  },
  label: {
    color: "white",
    fontSize: 13,
    fontFamily: "PoppinsLight",
    marginTop: 10,
    marginBottom: 5,
    opacity: 0.5,
    alignSelf: "center",
  },
  label_active: {
    color: "white",
    fontSize: 13,
    fontFamily: "PoppinsLight",
    marginTop: 10,
    marginBottom: 5,
    alignSelf: "center",
  },
  checkbox: {
    color: "#666666",
    fontSize: 20,
    position: "absolute",
    top: 10,
    left: 10,
  },
  checkbox_active: {
    color: "#0781E1",
    fontSize: 20,
    position: "absolute",
    top: 10,
    left: 10
  },
});
