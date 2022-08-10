import React from "react";
import { Image, StyleSheet } from "react-native";

const LevelImage = ({ index, style }) => {
  switch (index) {
    case 0:
      return (
        <Image
          style={[styles.default, style]}
          source={require("../../data/img/lvl1.png")}
        />
      );
    case 1:
      return (
        <Image
          style={[styles.default, style]}
          source={require("../../data/img/lvl2.png")}
        />
      );
    case 2:
      return (
        <Image
          style={[styles.default, style]}
          source={require("../../data/img/lvl3.png")}
        />
      );
    case 3:
      return (
        <Image
          style={[styles.default, style]}
          source={require("../../data/img/lvl4.png")}
        />
      );
    case 4:
      return (
        <Image
          style={[styles.default, style]}
          source={require("../../data/img/lvl5.png")}
        />
      );
    case 5:
      return (
        <Image
          style={[styles.default, style]}
          source={require("../../data/img/lvl6.png")}
        />
      );
    default:
      return (
        <Image
          style={[styles.default, style]}
          source={require("../../data/img/lvl7.png")}
        />
      );
  }
};

const styles = StyleSheet.create({
  default: {
    width: 130,
    height: 130,
    marginTop: -45,
  },
});

export default LevelImage;
