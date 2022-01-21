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

import toGermanDate from "../DateConversion";

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

const StatsDashboard = ({ user, localData }) => {
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
  }, []);

  const calcDailyAverage = (array) => {
    return (
      array.length /
      ((localData[localData.length - 1].timestamp - localData[0].timestamp) /
        (60 * 60 * 24 * 1000))
    );
  };

  const filterByType = (array, type) => {
    return array.filter((entry) => {
      return entry.type === type;
    });
  };

  const isNextDay = (daysDiff, absDiff, monat, jahr) => {
    const monat31 = [1, 3, 5, 7, 8, 10, 12];
    const monat30 = [4, 6, 9, 11];

    if (daysDiff == 1 && absDiff <= 2 * 1000 * 60 * 60 * 24) {
      // Tage folgen aufeinander, gleicher Monat
      return 1;
    } else if (
      daysDiff == 30 &&
      absDiff <= 2 * 1000 * 60 * 60 * 24 &&
      monat31.includes(monat)
    ) {
      // Tage folgen aufeinander, monatsübergreifend (31 Tage)
      return 1;
    } else if (
      daysDiff == 29 &&
      absDiff <= 2 * 1000 * 60 * 60 * 24 &&
      monat30.includes(monat)
    ) {
      // Tage folgen aufeinander, monatsübergreifend (30 Tage)
      return 1;
    } else if (
      daysDiff == 28 &&
      absDiff <= 2 * 1000 * 60 * 60 * 24 &&
      monat == 2 &&
      jahr % 4 == 0
    ) {
      // Tage folgen aufeinander, monatsübergreifend (Februar, Schaltjahr)
      return 1;
    } else if (
      daysDiff == 27 &&
      absDiff <= 2 * 1000 * 60 * 60 * 24 &&
      monat == 2 &&
      jahr % 4 != 0
    ) {
      // Tage folgen aufeinander, monatsübergreifend (Februar, kein Schaltjahr)
      return 1;
    } else if (daysDiff > 1) {
      // Tage folgen nicht aufeinander
      return 2;
    }
    // Ansonsten: Tage sind identisch (irrelevant)
    return 3;
  };

  const calcStreak = (array) => {
    let current = 1;
    let longest = 1;
    let smokedToday = false;

    let endDate = new Date(array[0].timestamp);

    array.forEach((entry, i) => {
      if (i >= 1) {
        let daysDiff =
          new Date(entry.timestamp).getDate() -
          new Date(array[i - 1].timestamp).getDate();
        let absDiff = entry.timestamp - array[i - 1].timestamp;
        let monat = new Date(array[i - 1].timestamp).getMonth();
        let jahr = new Date(entry.timestamp).getFullYear();

        if (isNextDay(daysDiff, absDiff, monat, jahr) == 1) {
          current++;
        } else if (isNextDay(daysDiff, absDiff, monat, jahr) == 2) {
          if (current > longest) {
            longest = current;
            endDate = new Date(array[i - 1].timestamp);
          }
          current = 1;
        }
      }
    });

    if (current > longest) {
      longest = current;
      endDate = new Date(array[array.length - 1].timestamp);
    }

    const startDateLongest = new Date(
      endDate - (longest - 1) * 1000 * 60 * 60 * 24
    );
    let startDateCurrent = new Date(
      new Date(array[array.length - 1].timestamp) -
        (current - 1) * 1000 * 60 * 60 * 24
    );

    const daysDiffLast =
      new Date(Date.now()).getDate() -
      new Date(array[array.length - 1].timestamp).getDate();
    const absDiffLast = Date.now() - array[array.length - 1].timestamp;
    const monatLast = new Date(array[array.length - 1].timestamp).getMonth();
    const jahrLast = new Date(Date.now()).getFullYear();

    // Checkt, ob der letzte Eintrag weder heute noch gestern passiert ist
    if (isNextDay(daysDiffLast, absDiffLast, monatLast, jahrLast) == 2) {
      current = 0;
      startDateCurrent = null;
    } else if (isNextDay(daysDiffLast, absDiffLast, monatLast, jahrLast) == 3) {
      smokedToday = true;
    }

    return [
      longest,
      toGermanDate(startDateLongest),
      toGermanDate(endDate),
      current,
      toGermanDate(startDateCurrent),
      smokedToday,
    ];
  };

  // Berechne Statistiken
  const [averageMain, setAverageMain] = useState(calcDailyAverage(localData));
  const [averageJoint, setAverageJoint] = useState(
    calcDailyAverage(filterByType(localData, "joint"))
  );
  const [averageBong, setAverageBong] = useState(
    calcDailyAverage(filterByType(localData, "bong"))
  );
  const [averageVape, setAverageVape] = useState(
    calcDailyAverage(filterByType(localData, "vape"))
  );
  const [streakData, setStreakData] = useState(calcStreak(localData));

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
        <View
          style={{
            flexDirection: "row",
            width: "98%",
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
            {selectedValue === "main"
              ? Math.round(averageMain * 100) / 100
              : null}
            {selectedValue === "joint"
              ? Math.round(averageJoint * 100) / 100
              : null}
            {selectedValue === "bong"
              ? Math.round(averageBong * 100) / 100
              : null}
            {selectedValue === "vape"
              ? Math.round(averageVape * 100) / 100
              : null}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: "#0080FF",
              fontFamily: "PoppinsLight",
            }}
          >
            Ø Tag
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
              <Text style={styles.card_label}>Ø Woche</Text>
              <Text style={styles.card_value}>
                {selectedValue === "main"
                  ? Math.round(averageMain * 7 * 10) / 10
                  : null}
                {selectedValue === "joint"
                  ? Math.round(averageJoint * 7 * 10) / 10
                  : null}
                {selectedValue === "bong"
                  ? Math.round(averageBong * 7 * 10) / 10
                  : null}
                {selectedValue === "vape"
                  ? Math.round(averageVape * 7 * 10) / 10
                  : null}
              </Text>
            </View>

            <View style={styles.card_container}>
              <Text style={styles.card_label}>Ø Monat</Text>
              <Text style={styles.card_value}>
                {selectedValue === "main"
                  ? Math.round(averageMain * 30.5 * 10) / 10
                  : null}
                {selectedValue === "joint"
                  ? Math.round(averageJoint * 30.5 * 10) / 10
                  : null}
                {selectedValue === "bong"
                  ? Math.round(averageBong * 30.5 * 10) / 10
                  : null}
                {selectedValue === "vape"
                  ? Math.round(averageVape * 30.5 * 10) / 10
                  : null}
              </Text>
            </View>

            <View style={styles.card_container}>
              <Text style={styles.card_label}>Ø Jahr</Text>
              <Text style={styles.card_value}>
                {selectedValue === "main"
                  ? Math.round(averageMain * 365 * 10) / 10
                  : null}
                {selectedValue === "joint"
                  ? Math.round(averageJoint * 365 * 10) / 10
                  : null}
                {selectedValue === "bong"
                  ? Math.round(averageBong * 365 * 10) / 10
                  : null}
                {selectedValue === "vape"
                  ? Math.round(averageVape * 365 * 10) / 10
                  : null}
              </Text>
            </View>
          </View>

          <View style={{ height: 10 }}></View>

          <View style={styles.card_container_wide}>
            <Text style={styles.card_label}>Längster Streak</Text>
            <Text style={[styles.card_value, { fontSize: 25 }]}>
              {streakData[0]} Tage
            </Text>
            <Text style={[styles.card_value, { fontSize: 20 }]}>
              ({streakData[1]} -{streakData[2]})
            </Text>
          </View>

          <View style={{ height: 10 }}></View>

          <View style={styles.card_container_wide}>
            <Text style={styles.card_label}>Aktueller Streak</Text>
            {streakData[5] ? (
              <Text style={[styles.card_value, { fontSize: 25 }]}>
                {streakData[3]} Tage
              </Text>
            ) : (
              <Text
                style={[styles.card_value, { fontSize: 25, color: "#D0342C" }]}
              >
                {streakData[3]} Tage
              </Text>
            )}
            <Text style={[styles.card_value, { fontSize: 20 }]}>
              (seit {streakData[4]})
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
