import React from "react";
import { useState, useEffect, useRef } from "react";
import { useFonts } from "expo-font";
import {
  StyleSheet,
  Image,
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
  Picker,
  Animated,
  Easing,
} from "react-native";

import { ref, query, onChildAdded } from "firebase/database";
import { db } from "./FirebaseConfig";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
  graphStyle,
} from "react-native-chart-kit";

const StatsDashboard = ({ user, dbData }) => {
  const [loaded] = useFonts({
    PoppinsBlack: require("./fonts/Poppins-Black.ttf"),
    PoppinsLight: require("./fonts/Poppins-Light.ttf"),
  });
  const [selectedValue, setSelectedValue] = useState("main");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.bezier(0.07, 1, 0.33, 0.89),
    }).start();

    console.log("Anzahl der heruntergeladenen Einträge: " + dbData.length);
    if (dbData.length != 0) {
      console.log(
        "Gesamt: Durchschnittlich " +
          calcDailyAverage("total") +
          " mal am Tag konsumiert."
      );
      console.log(
        "Joint: Durchschnittlich " +
          calcDailyAverage("joint") +
          " mal am Tag konsumiert."
      );
      console.log(
        "Bong: Durchschnittlich " +
          calcDailyAverage("bong") +
          " mal am Tag konsumiert."
      );
      console.log(
        "Vape: Durchschnittlich " +
          calcDailyAverage("vape") +
          " mal am Tag konsumiert."
      );
    }
  }, []);

  const calcDailyAverage = (type) => {
    switch (type) {
      case "total":
        return (
          dbData.length /
          ((dbData[dbData.length - 1].timestamp - dbData[0].timestamp) /
            (60 * 60 * 24 * 1000))
        );
      default:
        return (
          dbData.filter((entry) => {
            return entry.type === type;
          }).length /
          ((dbData[dbData.length - 1].timestamp - dbData[0].timestamp) /
            (60 * 60 * 24 * 1000))
        );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={{ height: 10 }}></View>

        <View style={{ alignItems: "center", flex: 1 }}>
          <Text
            style={{
              fontSize: 60,
              color: "#0080FF",
              fontFamily: "PoppinsBlack",
              marginBottom: -25,
            }}
          >
            44,2
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: "#0080FF",
              fontFamily: "PoppinsLight",
            }}
          >
            Einträge
          </Text>

          <View style={{ height: 10 }}></View>

          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <View style={styles.card_container}>
              <Text style={styles.card_label}>Label 1</Text>
              <Text style={styles.card_value}>43,6</Text>
            </View>

            <View style={styles.card_container}>
              <Text style={styles.card_label}>Label 2</Text>
              <Text style={styles.card_value}>87,2</Text>
            </View>

            <View style={styles.card_container}>
              <Text style={styles.card_label}>Label 3</Text>
              <Text style={styles.card_value}>31,5</Text>
            </View>
          </View>

          <View style={{ height: 10 }}></View>

          <View style={styles.card_container_wide}>
            <Text style={styles.card_label}>Hier könnte etwas stehen</Text>
            <Text style={[styles.card_value, { fontSize: 25 }]}>
              Hier natürlich auch
            </Text>
          </View>

          <View style={{ height: 40 }}></View>

          <Text
            style={[
              styles.card_value,
              {
                borderTopColor: "#0080FF",
                borderTopWidth: 2,
                paddingRight: 10,
                paddingLeft: 10,
              },
            ]}
          >
            28,4
          </Text>
          <Text style={[styles.card_label, { marginTop: -15 }]}>Label 4</Text>

          <View style={{ height: 20 }}></View>

          <Text
            style={[
              styles.card_value,
              {
                borderTopColor: "#0080FF",
                borderTopWidth: 2,
                paddingRight: 10,
                paddingLeft: 10,
              },
            ]}
          >
            59,1
          </Text>
          <Text style={[styles.card_label, { marginTop: -15 }]}>Label 5</Text>

          <View style={{ height: 20 }}></View>

          <Text
            style={[
              styles.card_value,
              {
                borderTopColor: "#0080FF",
                borderTopWidth: 2,
                paddingRight: 10,
                paddingLeft: 10,
              },
            ]}
          >
            248,7
          </Text>
          <Text style={[styles.card_label, { marginTop: -15 }]}>Label 6</Text>

          <View style={{ height: 20 }}></View>

          <View
            style={{
              flexDirection: "row",
              width: "95%",
              justifyContent: "center",
            }}
          >
            <Pressable
              style={
                selectedValue == "main"
                  ? styles.switch_item_active
                  : styles.switch_item
              }
              onPress={() => setSelectedValue("main")}
            >
              <Text
                style={
                  selectedValue == "main"
                    ? styles.switch_text_active
                    : styles.text_item
                }
              >
                Gesamt
              </Text>
            </Pressable>
            <Pressable
              style={
                selectedValue == "joint"
                  ? styles.switch_item_active
                  : styles.switch_item
              }
              onPress={() => setSelectedValue("joint")}
            >
              <Text
                style={
                  selectedValue == "joint"
                    ? styles.switch_text_active
                    : styles.text_item
                }
              >
                Joint
              </Text>
            </Pressable>
            <Pressable
              style={
                selectedValue == "bong"
                  ? styles.switch_item_active
                  : styles.switch_item
              }
              onPress={() => setSelectedValue("bong")}
            >
              <Text
                style={
                  selectedValue == "bong"
                    ? styles.switch_text_active
                    : styles.text_item
                }
              >
                Bong
              </Text>
            </Pressable>
            <Pressable
              style={
                selectedValue == "vape"
                  ? styles.switch_item_active
                  : styles.switch_item
              }
              onPress={() => setSelectedValue("vape")}
            >
              <Text
                style={
                  selectedValue == "vape"
                    ? styles.switch_text_active
                    : styles.text_item
                }
              >
                Vape
              </Text>
            </Pressable>
          </View>

          <View style={{ height: 20 }}></View>

          <LineChart
            data={{
              labels: ["1", "2", "3", "4", "5", "6"],
              datasets: [
                {
                  data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                  ],
                },
              ],
            }}
            width={(Dimensions.get("window").width / 10) * 9} // from react-native
            height={200}
            yAxisLabel="$"
            yAxisSuffix="k"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "#1E1E1E",
              backgroundGradientFrom: "#171717",
              backgroundGradientTo: "#171717",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 50,
              },
              propsForDots: {
                r: "2",
                strokeWidth: "5",
                stroke: "#0080FF",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />

          <View style={{ height: 10 }}></View>

          <BarChart
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            data={{
              labels: ["January", "February", "March", "April", "May", "June"],
              datasets: [
                {
                  data: [20, 45, 28, 80, 99, 43],
                },
              ],
            }}
            width={(Dimensions.get("window").width / 10) * 9}
            height={220}
            yAxisLabel="$"
            chartConfig={{
              backgroundColor: "#1E1E1E",
              backgroundGradientFrom: "#171717",
              backgroundGradientTo: "#171717",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 50,
              },
              propsForDots: {
                r: "2",
                strokeWidth: "5",
                stroke: "#0080FF",
              },
            }}
            verticalLabelRotation={30}
          />

          <View style={{ height: 20 }}></View>

          <ContributionGraph
            values={[
              { date: "2017-01-02", count: 1 },
              { date: "2017-01-03", count: 2 },
              { date: "2017-01-04", count: 3 },
              { date: "2017-01-05", count: 4 },
              { date: "2017-01-06", count: 5 },
              { date: "2017-01-30", count: 2 },
              { date: "2017-01-31", count: 3 },
              { date: "2017-03-01", count: 2 },
              { date: "2017-04-02", count: 4 },
              { date: "2017-03-05", count: 2 },
              { date: "2017-02-30", count: 4 },
            ]}
            endDate={new Date("2017-04-01")}
            numDays={105}
            width={(Dimensions.get("window").width / 10) * 9}
            height={220}
            chartConfig={{
              backgroundColor: "#1E1E1E",
              backgroundGradientFrom: "#171717",
              backgroundGradientTo: "#171717",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 20,
              },
              propsForDots: {
                r: "2",
                strokeWidth: "5",
                stroke: "#0080FF",
              },
            }}
          />

          <View style={{ height: 20 }}></View>

          {/* <PieChart
            data={[
                {
                  name: "Seoul",
                  population: 21500000,
                  color: "rgba(131, 167, 234, 1)",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15
                },
                {
                  name: "Toronto",
                  population: 2800000,
                  color: "#F00",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15
                },
                {
                  name: "Beijing",
                  population: 527612,
                  color: "red",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15
                },
                {
                  name: "New York",
                  population: 8538000,
                  color: "#ffffff",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15
                },
                {
                  name: "Moscow",
                  population: 11920000,
                  color: "rgb(0, 0, 255)",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15
                }
              ]}
            width={Dimensions.get("window").width / 10 * 9}
            height={220}
            chartConfig={{
                backgroundColor: "#1E1E1E",
                backgroundGradientFrom: "#171717",
                backgroundGradientTo: "#171717",
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                    borderRadius: 20
                },
                propsForDots: {
                    r: "2",
                    strokeWidth: "5",
                    stroke: "#0080FF"
                }
                }}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            center={[10, 50]}
            absolute
        /> */}
        </View>
      </Animated.View>
    </ScrollView>
  );
};

export default StatsDashboard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E1E1E",
    width: "100%",
  },
  heading: {
    fontFamily: "PoppinsBlack",
    color: "#c4c4c4",
    fontSize: 20,
    marginLeft: 10,
  },
  card_container: {
    backgroundColor: "#171717",
    width: "25%",
    margin: 10,
    padding: 15,
    borderRadius: 25,
    borderTopColor: "#0080FF",
    borderTopWidth: 2,
  },
  card_label: {
    color: "#8a8a8a",
    fontFamily: "PoppinsLight",
    fontSize: 14,
    marginTop: 5,
    textAlign: "left",
  },
  card_value: {
    color: "#c4c4c4",
    fontFamily: "PoppinsBlack",
    fontSize: 30,
    marginTop: -10,
    textAlign: "left",
  },
  card_container_wide: {
    backgroundColor: "#171717",
    width: "85%",
    padding: 15,
    borderRadius: 25,
    borderTopColor: "#0080FF",
    borderTopWidth: 2,
  },
  switch_item: {
    backgroundColor: "#171717",
    margin: 3,
    padding: 3,
    paddingLeft: 20,
    paddingRight: 20,
    paddingRight: 20,
    borderRadius: 20,
    flex: 1,
    paddingTop: 5,
    borderColor: "#171717",
    borderWidth: 1,
    paddingTop: 8,
    paddingBottom: 8,
  },
  switch_item_active: {
    backgroundColor: "#171717",
    margin: 3,
    padding: 3,
    paddingLeft: 20,
    paddingRight: 20,
    paddingRight: 20,
    borderRadius: 20,
    flex: 1,
    borderColor: "#0080FF",
    borderWidth: 1,
    paddingTop: 8,
    paddingBottom: 8,
  },
  text_item: {
    color: "#808080",
    fontFamily: "PoppinsLight",
    textAlignVertical: "center",
    textAlign: "center",
    fontSize: 12,
  },
  switch_text_active: {
    fontFamily: "PoppinsLight",
    color: "#0080FF",
    textAlignVertical: "center",
    textAlign: "center",
    fontSize: 12,
  },
});
