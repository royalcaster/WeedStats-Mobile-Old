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

import SwitchSelector from 'react-native-switch-selector'

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
  const [selectedType, setSelectedType] = useState("main");
  const [selectedTime, setSelectedTime] = useState(0);

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
    if (type === "main") {
      return array;
    }
    return array.filter((entry) => {
      return entry.type === type;
    });
  };

  const filterByMostRecent = (array, days) => {
    if (days === 0) {
      return array;
    }

    const now = Date.now();

    return array.filter((entry) => {
      return now - entry.timestamp <= days * 1000 * 60 * 60 * 24;
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

  const createLineChartData = (array, datapoints) => {
    const first = array[0].timestamp;
    const step = (Date.now() - first) / datapoints;
    let chartData = new Array(datapoints).fill(0);
    let chartLabels = new Array(datapoints);

    array.forEach((entry) => {
      for (let i = 0; i < datapoints; i++) {
        if (
          first + i * step <= entry.timestamp &&
          entry.timestamp < first + (i + 1) * step
        ) {
          chartData[i]++;
          break;
        }
      }
    });

    for (let i = 0; i < datapoints; i++) {
      chartLabels[i] = toGermanDate(new Date(first + (i + 0.5) * step));
    }

    return [chartLabels, chartData];
  };

  const createBarChartData = (array) => {
    let chartData = new Array(7).fill(0);
    let i;

    array.forEach((entry) => {
      i = new Date(entry.timestamp).getDay();
      i == 0 ? (i = 6) : (i = i - 1);
      chartData[i]++;
    });

    return chartData;
  };

  const [streakData, setStreakData] = useState(calcStreak(localData));

  const options_type = [
    { label: "Gesamt", value: 0 },
    { label: "Joint", value: 1 },
    { label: "Bong", value: 2 },
    { label: "Vape", value: 3 }
  ];

  const options_time = [
    { label: "Gesamt", value: 4 },
    { label: "letzte Woche", value: 5 },
    { label: "letzter Monat", value: 6 },
    { label: "letztes Jahr", value: 7 }
  ];

  const toggleSelection = (index) => {
    switch(index){
      case 0: setSelectedType("main"); break;
      case 1: setSelectedType("joint"); break;
      case 2: setSelectedType("bong"); break;
      case 3: setSelectedType("vape"); break;
      case 4: setSelectedTime(0); break;
      case 5: setSelectedTime(7); break;
      case 6: setSelectedTime(30); break;
      case 7: setSelectedTime(365); break;
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>

        <View style={{height: 20}}></View>
        <Text style={styles.heading2}>Überblick</Text>
        <View style={{height: 10}}></View>

        <View style={{width: "95%"}}>
          <SwitchSelector 
            options={options_type} 
            initial={0} 
            onPress={value => toggleSelection(value)}
            textColor={"white"}
            backgroundColor={"#171717"}
            selectedColor={"white"}
            buttonColor={"#0080FF"}
            textStyle={{fontFamily: "PoppinsLight"}}
            selectedTextStyle={{fontFamily: "PoppinsLight"}}
          />
        </View>

        {/* <View
          style={{
            flexDirection: "row",
            width: "98%",
            justifyContent: "center",
          }}
        >
          <Pressable
            style={
              selectedType == "main"
                ? styles.switch_item_active
                : styles.switch_item
            }
            onPress={() => setSelectedType("main")}
          >
            <Text
              style={
                selectedType == "main"
                  ? [
                      styles.switch_text_active,
                      { textDecorationLine: "underline" },
                    ]
                  : [styles.text_item, { textDecorationLine: "underline" }]
              }
            >
              Gesamt
            </Text>
          </Pressable>
          <Pressable
            style={
              selectedType == "joint"
                ? styles.switch_item_active
                : styles.switch_item
            }
            onPress={() => setSelectedType("joint")}
          >
            <Text
              style={
                selectedType == "joint"
                  ? styles.switch_text_active
                  : styles.text_item
              }
            >
              Joint
            </Text>
          </Pressable>
          <Pressable
            style={
              selectedType == "bong"
                ? styles.switch_item_active
                : styles.switch_item
            }
            onPress={() => setSelectedType("bong")}
          >
            <Text
              style={
                selectedType == "bong"
                  ? styles.switch_text_active
                  : styles.text_item
              }
            >
              Bong
            </Text>
          </Pressable>
          <Pressable
            style={
              selectedType == "vape"
                ? styles.switch_item_active
                : styles.switch_item
            }
            onPress={() => setSelectedType("vape")}
          >
            <Text
              style={
                selectedType == "vape"
                  ? styles.switch_text_active
                  : styles.text_item
              }
            >
              Vape
            </Text>
          </Pressable>
        </View> */}


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
            {Math.round(
              calcDailyAverage(filterByType(localData, selectedType)) * 100
            ) / 100}
          </Text>
          <Text
            style={{
              fontSize: 18,
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
              justifyContent: "space-evenly",
            }}
          >
            <View style={styles.card_container}>
              <Text style={styles.card_label}>Ø Woche</Text>
              <Text style={styles.card_value}>
                {Math.round(
                  calcDailyAverage(filterByType(localData, selectedType)) *
                    7 *
                    10
                ) / 10}
              </Text>
            </View>

            <View style={styles.card_container}>
              <Text style={styles.card_label}>Ø Monat</Text>
              <Text style={styles.card_value}>
                {Math.round(
                  calcDailyAverage(filterByType(localData, selectedType)) *
                    30.5 *
                    10
                ) / 10}
              </Text>
            </View>

            <View style={styles.card_container}>
              <Text style={styles.card_label}>Ø Jahr</Text>
              <Text style={styles.card_value}>
                {Math.round(
                  calcDailyAverage(filterByType(localData, selectedType)) * 365
                )}
              </Text>
            </View>
          </View>

          <Text
            style={[
              styles.card_label,
              { marginTop: 15, fontSize: 18, color: "#c4c4c4" },
            ]}
          >
            {selectedType === "main" ? "Einträge" : null}
            {selectedType === "joint" ? "Joints" : null}
            {selectedType === "bong" ? "Bongs" : null}
            {selectedType === "vape" ? "Vapes" : null} in den letzten
          </Text>
          <View
            style={{
              flexDirection: "row",
              width: "98%",
              flex: 1,
              justifyContent: "space-evenly",
            }}
          >
            <View>
              <Text
                style={[
                  styles.card_label,
                  { marginTop: 0, textAlign: "center" },
                ]}
              >
                24 Stunden
              </Text>
              <Text
                style={[
                  styles.card_value,
                  {
                    borderTopColor: "#0080FF",
                    borderTopWidth: 2,
                    marginTop: 0,
                    textAlign: "center",
                  },
                ]}
              >
                {
                  filterByMostRecent(filterByType(localData, selectedType), 1)
                    .length
                }
              </Text>
            </View>
            <View>
              <Text
                style={[
                  styles.card_label,
                  { marginTop: 0, textAlign: "center" },
                ]}
              >
                7 Tagen
              </Text>
              <Text
                style={[
                  styles.card_value,
                  {
                    borderTopColor: "#0080FF",
                    borderTopWidth: 2,
                    paddingRight: 10,
                    paddingLeft: 10,
                    marginTop: 0,
                    textAlign: "center",
                  },
                ]}
              >
                {
                  filterByMostRecent(filterByType(localData, selectedType), 7)
                    .length
                }
              </Text>
            </View>
            <View>
              <Text
                style={[
                  styles.card_label,
                  { marginTop: 0, textAlign: "center" },
                ]}
              >
                30 Tagen
              </Text>
              <Text
                style={[
                  styles.card_value,
                  {
                    borderTopColor: "#0080FF",
                    borderTopWidth: 2,
                    paddingRight: 10,
                    paddingLeft: 10,
                    marginTop: 0,
                    textAlign: "center",
                  },
                ]}
              >
                {
                  filterByMostRecent(filterByType(localData, selectedType), 30)
                    .length
                }
              </Text>
            </View>
          </View>

          {selectedType === "main" ? (
            <>
              <View style={{ height: 10 }}></View>

              <View style={styles.card_container_wide}>
                <Text style={styles.card_label}>Aktueller Streak</Text>
                {streakData[5] ? (
                  <Text style={[styles.card_value, { fontSize: 25 }]}>
                    {streakData[3]} Tage
                  </Text>
                ) : (
                  <Text
                    style={[
                      styles.card_value,
                      { fontSize: 25, color: "#D0342C" },
                    ]}
                  >
                    {streakData[3]} Tage
                  </Text>
                )}
                {streakData[4] ? (
                  <Text style={[styles.card_value, { fontSize: 20 }]}>
                    (seit {streakData[4]})
                  </Text>
                ) : null}
                <Text style={styles.card_label}>Längster Streak</Text>
                <Text style={[styles.card_value, { fontSize: 25 }]}>
                  {streakData[0]} Tage
                </Text>
                <Text style={[styles.card_value, { fontSize: 20 }]}>
                  ({streakData[1]} -{streakData[2]})
                </Text>
              </View>
            </>
          ) : null}

          <View style={{height: 20}}></View>

          <Text style={styles.heading2}>Grafiken</Text>
          <View style={{height: 10}}></View>

            <SwitchSelector
              options={options_time} 
              initial={0}
              onPress={value => toggleSelection(value)}
              textColor={"white"}
              backgroundColor={"#171717"}
              selectedColor={"white"}
              buttonColor={"#0080FF"}
              textStyle={{fontFamily: "PoppinsLight"}}
              selectedTextStyle={{fontFamily: "PoppinsLight"}}
              style={{width: "95%"}}
            />

         {/*  <View
            style={{
              flexDirection: "row",
              width: "98%",
              justifyContent: "center",
            }}
          >
            <Pressable
              style={
                selectedTime == 0
                  ? styles.switch_item_active
                  : styles.switch_item
              }
              onPress={() => setSelectedTime(0)}
            >
              <Text
                style={
                  selectedTime == 0
                    ? [
                        styles.switch_text_active,
                        { textDecorationLine: "underline" },
                      ]
                    : [styles.text_item, { textDecorationLine: "underline" }]
                }
              >
                Gesamt
              </Text>
            </Pressable>
            <Pressable
              style={
                selectedTime == 7
                  ? styles.switch_item_active
                  : styles.switch_item
              }
              onPress={() => setSelectedTime(7)}
            >
              <Text
                style={
                  selectedTime == 7
                    ? styles.switch_text_active
                    : styles.text_item
                }
              >
                letzte Woche
              </Text>
            </Pressable>
            <Pressable
              style={
                selectedTime == 30
                  ? styles.switch_item_active
                  : styles.switch_item
              }
              onPress={() => setSelectedTime(30)}
            >
              <Text
                style={
                  selectedTime == 30
                    ? styles.switch_text_active
                    : styles.text_item
                }
              >
                letzter Monat
              </Text>
            </Pressable>
            <Pressable
              style={
                selectedTime == 365
                  ? styles.switch_item_active
                  : styles.switch_item
              }
              onPress={() => setSelectedTime(365)}
            >
              <Text
                style={
                  selectedTime == 365
                    ? styles.switch_text_active
                    : styles.text_item
                }
              >
                letztes Jahr
              </Text>
            </Pressable>
          </View> */}

          <View style={{ height: 20 }}></View>

          <LineChart
            style={{
              marginVertical: 10,
            }}
            data={{
              labels: createLineChartData(
                filterByMostRecent(
                  filterByType(localData, selectedType),
                  selectedTime
                ),
                7
              )[0],
              datasets: [
                {
                  data: createLineChartData(
                    filterByMostRecent(
                      filterByType(localData, selectedType),
                      selectedTime
                    ),
                    7
                  )[1],
                },
              ],
            }}
            width={Dimensions.get("window").width} // from react-native
            height={250}
            yAxisInterval={1} // optional, defaults to 1
            verticalLabelRotation={20}
            chartConfig={{
              backgroundGradientFrom: "#171717",
              backgroundGradientTo: "#1E1E1E",
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              propsForDots: {
                r: "1",
                strokeWidth: "5",
                stroke: "#0080FF",
              },
            }}
            bezier
          />

          <BarChart
            style={{
              marginVertical: 10,
            }}
            data={{
              labels: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
              datasets: [
                {
                  data: createBarChartData(
                    filterByMostRecent(
                      filterByType(localData, selectedType),
                      selectedTime
                    )
                  ),
                },
              ],
            }}
            width={Dimensions.get("window").width}
            height={250}
            chartConfig={{
              backgroundGradientFrom: "#171717",
              backgroundGradientTo: "#1E1E1E",
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
          />

          {selectedType === "main" ? (
            <PieChart
              style={{
                marginVertical: 10,
              }}
              data={[
                {
                  name: "Joint",
                  count: filterByMostRecent(
                    filterByType(localData, "joint"),
                    selectedTime
                  ).length,
                  color: "#c4c4c4",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15,
                },
                {
                  name: "Bong",
                  count: filterByMostRecent(
                    filterByType(localData, "bong"),
                    selectedTime
                  ).length,
                  color: "gray",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15,
                },
                {
                  name: "Vape",
                  count: filterByMostRecent(
                    filterByType(localData, "vape"),
                    selectedTime
                  ).length,
                  color: "black",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15,
                },
              ]}
              width={Dimensions.get("window").width}
              height={250}
              backgroundColor={"#171717"}
              chartConfig={{
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              accessor={"count"}
              paddingLeft={"15"}
              avoidFalseZero={true}
            />
          ) : null}
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
    width: "30%",
    margin: 5,
    padding: 10,
    paddingLeft: 20,
    borderRadius: 25,
    borderTopColor: "#0080FF",
    borderTopWidth: 2
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
  heading2: {
    color: "white",
    fontSize: 20,
    fontFamily: "PoppinsBlack",
    marginLeft: 20,
    alignSelf: "flex-start"
  },
});
