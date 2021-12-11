import React, { useState } from "react";
import { useEffect, useRef } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import moment from "moment";

import {
  StyleSheet,
  Text,
  TouchableWithoutFeedbackBase,
  View,
  Image,
  ScrollView,
  Pressable,
  Animated,
  Easing,
} from "react-native";

const Stats = ({ user, statConfig, toggleCounter }) => {
  const headingAnim = useRef(new Animated.Value(-70)).current;

  const leftAnim = useRef(new Animated.Value(-70)).current;
  const rightAnim = useRef(new Animated.Value(70)).current;

  useEffect(() => {
    Animated.timing(headingAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.bezier(0.07, 1, 0.33, 0.89),
    }).start();

    Animated.timing(leftAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.bezier(0.07, 1, 0.33, 0.89),
    }).start();

    Animated.timing(rightAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
      easing: Easing.bezier(0.07, 1, 0.33, 0.89),
    }).start();
  }, []);

  const [countdown, setCountDown] = useState(0);

  var target = "";
  useEffect(() => {
    //Idee: Prüfe, ob es am Tag vor 4:20 ist, oder nach 4:20. Wenn vor, berechne countdown von jetzt bis 4:20, wenn nach, berechne countdown von jetzt bis 4:20 des nächsten tages
    let now = new Date();
    let ft_current_year = new Date(now.getFullYear(), 3, 20, 0, 0);

    if (now.getTime() < ft_current_year.getTime()) {
      let a = moment(now);
      let b = moment(ft_current_year);
      target = b.diff(a, "days");
    } else {
      let ft_next_year = new Date(
        ft_current_year.setFullYear(ft_current_year.getFullYear() + 1)
      );
      let a = moment(now);
      let b = moment(ft_next_year);
      target = b.diff(a, "days");
    }
    setCountDown(target);
  });

  return (
    <>
      <ScrollView></ScrollView>
    </>
  );
};

export default Stats;

const styles = StyleSheet.create({});
