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

import toGermanDate from "../DateConversion";

import SwitchSelector from "react-native-switch-selector";

import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { summary, streakRanges, trackRecord } from "date-streaks";
import { LinearGradient } from "expo-linear-gradient";

const StatsDashboard = ({ user, localData }) => {
  const [loaded] = useFonts({
    PoppinsBlack: require("./fonts/Poppins-Black.ttf"),
    PoppinsLight: require("./fonts/Poppins-Light.ttf"),
  });
  const [selectedType, setSelectedType] = useState("main");
  const [selectedTime, setSelectedTime] = useState(0);

  const icon_slide = useRef(new Animated.Value(-50)).current;
  const icon_opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    icon_slide.setValue(-50);
    Animated.timing(
      icon_slide, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.bezier(0.07, 1, 0.33, 0.89),
        delay: 0
      }
    ).start();
    icon_opacity.setValue(0);
    Animated.timing(
      icon_opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        delay: 0
      }
    ).start();
  },[selectedType]);

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

  /*   const isNextDay = (daysDiff, absDiff, monat, jahr) => {
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
  }; */

  /*   const calcStreak = (array) => {
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
  }; */

  const calcStreak = (array) => {
    const dates = getEntryDates(array);
    const length = Math.ceil((Date.now() - dates[0]) / (1000 * 60 * 60 * 24));
    const rec = trackRecord({ dates, length });
    const sum1 = summary(dates);
    const ranges1 = streakRanges(dates);
    const breakDates = getBreakDates({ rec });
    const sum2 = summary(breakDates);
    const ranges2 = streakRanges(breakDates);

    return {
      currentStreak: sum1.currentStreak,
      longestStreak: sum1.longestStreak,
      today: sum1.todayInStreak,
      within: sum1.withinCurrentStreak,
      startCurrent: toGermanDate(ranges1[0].start),
      rangeLongest: ranges1.find(
        ({ duration }) => duration === sum1.longestStreak
      ),
      currentBreak: sum2.currentStreak,
      longestBreak: sum2.longestStreak,
      startCurrentBreak: ranges2[0] ? toGermanDate(ranges2[0].start) : null,
      rangeLongestBreak: ranges2[0]
        ? ranges2.find(({ duration }) => duration === sum2.longestStreak)
        : null,
    };
  };

  const getEntryDates = (array) => {
    let dates = array.map((entry) => {
      let date = new Date(entry.timestamp);
      date.setUTCHours(0, 0, 0, 0);
      return +date;
    });

    dates = dates.filter(function (value, index, array) {
      return array.indexOf(value) === index;
    });

    return dates;
  };

  const getBreakDates = ({ rec }) => {
    // Konvertiert Object in verschachteltes Array
    let dates = Object.entries(rec);

    // Filtert nach den Daten, an denen nicht gesmoked wurde
    dates = dates.filter((entry) => entry[1] === false);

    // Wirft das überflüssige zweite property weg -> eindim. Array
    dates = dates.map((entry) => Date.parse(entry[0]));

    return dates;
  };

  const createLineChartData = (array, datapoints) => {
    if (array.length == 0) {
      return [
        ["keine Angaben", "keine Angaben"],
        [0, 0],
      ];
    }

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
    { label: "Vape", value: 3 },
    { label: "Pfeife", value: 4 },
    { label: "Edible", value: 5 },
  ];

  const options_time = [
    { label: "Gesamt", value: 6 },
    { label: "letzte Woche", value: 7 },
    { label: "letzter Monat", value: 8 },
    { label: "letztes Jahr", value: 9 },
  ];

  const toggleSelection = (index) => {
    switch (index) {
      case 0:
        setSelectedType("main");
        break;
      case 1:
        setSelectedType("joint");
        break;
      case 2:
        setSelectedType("bong");
        break;
      case 3:
        setSelectedType("vape");
        break;
      case 4:
        setSelectedType("pipe");
        break;
      case 5:
        setSelectedType("cookie");
        break;
      case 6:
        setSelectedTime(0);
        break;
      case 7:
        setSelectedTime(7);
        break;
      case 8:
        setSelectedTime(30);
        break;
      case 9:
        setSelectedTime(365);
        break;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
        <View style={{ height: 20 }}></View>
        <Text style={styles.heading2}>Überblick</Text>
        <View style={{ height: 10 }}></View>

        <View style={{ width: "95%" }}>
          <SwitchSelector
            options={options_type}
            initial={0}
            onPress={(value) => toggleSelection(value)}
            textColor={"white"}
            backgroundColor={"#171717"}
            selectedColor={"white"}
            buttonColor={"#0080FF"}
            textStyle={{ fontFamily: "PoppinsLight", fontSize: 12}}
            selectedTextStyle={{ fontFamily: "PoppinsBlack", fontSize: 12}}
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

        <View style={{ height: 30 }}></View>

        <View style={{ alignItems: "center", flex: 1 }}>

          <LinearGradient colors={["#369bff","#0080FF","#004e9c"]} style={{borderRadius: 25, padding: 20, width: 250}}>
          {selectedType === "main" ? (
            <Animated.View
              style={{transform: [{translateX: icon_slide}], opacity: icon_opacity, width: "50%", alignSelf: "center"}}
              source={require("./img/joint.png")}>
              <Image style={{height: 40, width: 15, position: "absolute"}} source={require("./img/joint.png")}/>
              <Image style={{height: 40, width: 25, position: "absolute", left: "12%"}} source={require("./img/bong.png")}/>
              <Image style={{height: 40, width: 25, position: "absolute", left: "30%"}} source={require("./img/vape.png")}/>
              <Image style={{height: 50, width: 25, position: "absolute", left: "53%", marginTop: -5}} source={require("./img/pipe.png")}/>
              <Image style={{height: 40, width: 38, position: "absolute", left: "74%"}} source={require("./img/cookie.png")}/>
             </Animated.View>
          ) : null}
          {selectedType === "joint" ? (
            <Animated.Image
              style={[styles.joint_img,{transform: [{translateX: icon_slide}], opacity: icon_opacity}]}
              source={require("./img/joint.png")}
            />
          ) : null}
          {selectedType === "bong" ? (
            <Animated.Image style={[styles.bong_img,{transform: [{translateX: icon_slide}], opacity: icon_opacity}]} source={require("./img/bong.png")} />
          ) : null}
          {selectedType === "vape" ? (
            <Animated.Image style={[styles.vape_img, {transform: [{translateX: icon_slide}], opacity: icon_opacity}]} source={require("./img/vape.png")} />
          ) : null}
          {selectedType === "pipe" ? (
            <Animated.Image style={[styles.pipe_img, {transform: [{translateX: icon_slide}], opacity: icon_opacity}]} source={require("./img/pipe.png")} />
          ) : null}
          {selectedType === "cookie" ? (
            <Animated.Image
              style={[styles.cookie_img, {transform: [{translateX: icon_slide}], opacity: icon_opacity}]}
              source={require("./img/cookie.png")}
            />
          ) : null}
          <View style={{height: 40}}></View>
          <View style={{alignSelf: "center"}}>
          <Animated.Text
            style={{
              fontSize: 60,
              color: "white",
              fontFamily: "PoppinsBlack",
              marginBottom: -25,
              transform: [{translateX: icon_slide}],
              opacity: icon_opacity
            }}
          >
            {Math.round(
              calcDailyAverage(filterByType(localData, selectedType)) * 100
            ) / 100}
          </Animated.Text>
          <Text
            style={{
              fontSize: 18,
              color: "white",
              fontFamily: "PoppinsLight",
            }}
          >
            Ø Tag
          </Text>
          </View>

          </LinearGradient>

          <View style={{ height: 30 }}></View>

          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-evenly",
            }}
          >
            <View style={styles.card_container}>
              <Text style={styles.card_label}>Ø Woche</Text>
              <Animated.Text style={[styles.card_value,{transform: [{translateY: icon_slide}],
              opacity: icon_opacity}]}>
                {Math.round(
                  calcDailyAverage(filterByType(localData, selectedType)) *
                    7 *
                    10
                ) / 10}
              </Animated.Text>
            </View>

            <View style={styles.card_container}>
              <Text style={styles.card_label}>Ø Monat</Text>
              <Animated.Text style={[styles.card_value,{transform: [{translateY: icon_slide}],
              opacity: icon_opacity}]}>
                {Math.round(
                  calcDailyAverage(filterByType(localData, selectedType)) *
                    30.5 *
                    10
                ) / 10}
              </Animated.Text>
            </View>

            <View style={styles.card_container}>
              <Text style={styles.card_label}>Ø Jahr</Text>
              <Animated.Text style={[styles.card_value,{transform: [{translateY: icon_slide}],
              opacity: icon_opacity}]}>
                {Math.round(
                  calcDailyAverage(filterByType(localData, selectedType)) * 365
                )}
              </Animated.Text>
            </View>
          </View>

          <View style={{height: 20}}></View>

          <Text
            style={[
              styles.card_label,
              { marginTop: 15, fontSize: 18, color: "#c4c4c4" },
            ]}
          >
            {selectedType === "main" ? "Einträge" : null}
            {selectedType === "joint" ? "Joints" : null}
            {selectedType === "bong" ? "Bongs" : null}
            {selectedType === "vape" ? "Vapes" : null}
            {selectedType === "pipe" ? "Pfeifen" : null}
            {selectedType === "cookie" ? "Edibles" : null} in den letzten
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
              <Animated.Text
                style={[
                  styles.card_value,
                  {
                    borderTopColor: "#0080FF",
                    borderTopWidth: 2,
                    marginTop: 0,
                    textAlign: "center",
                    transform: [{translateY: icon_slide}],
                  opacity: icon_opacity
                  },
                ]}
              >
                {
                  filterByMostRecent(filterByType(localData, selectedType), 1)
                    .length
                }
              </Animated.Text>
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
              <Animated.Text
                style={[
                  styles.card_value,
                  {
                    borderTopColor: "#0080FF",
                    borderTopWidth: 2,
                    paddingRight: 10,
                    paddingLeft: 10,
                    marginTop: 0,
                    textAlign: "center",
                    transform: [{translateY: icon_slide}],
                    opacity: icon_opacity
                  },
                ]}
              >
                {
                  filterByMostRecent(filterByType(localData, selectedType), 7)
                    .length
                }
              </Animated.Text>
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
              <Animated.Text
                style={[
                  styles.card_value,
                  {
                    borderTopColor: "#0080FF",
                    borderTopWidth: 2,
                    paddingRight: 10,
                    paddingLeft: 10,
                    marginTop: 0,
                    textAlign: "center",
                    transform: [{translateY: icon_slide}],
                    opacity: icon_opacity
                  },
                ]}
              >
                {
                  filterByMostRecent(filterByType(localData, selectedType), 30)
                    .length
                }
              </Animated.Text>
            </View>
          </View>

          <View style={{height: 20}}></View>

          <View style={{
            flexDirection: "row"
          }}>

          
          {selectedType === "main" ? (
            <>
              <View style={{ height: 10 }}></View>

              

              <Animated.View style={[styles.card_container_wide,{transform: [{translateY: icon_slide}],
              opacity: icon_opacity}]}>
                <Text style={styles.card_label}>Aktueller Streak</Text>
                <Text
                  style={[
                    styles.card_value,
                    { fontSize: 25 },
                    streakData.today
                      ? { color: "white" }
                      : { color: "#8a8a8a" },
                  ]}
                >
                  {streakData.currentStreak} Tage
                </Text>
                {streakData.within ? (
                  <Text style={[styles.card_value2]}>
                    (seit {streakData.startCurrent})
                  </Text>
                ) : null}
                <Text style={styles.card_label}>Längster Streak</Text>
                <Text style={[styles.card_value, { fontSize: 25 }]}>
                  {streakData.longestStreak} Tage
                </Text>
                <Text style={[styles.card_value2]}>
                  {<>{toGermanDate(streakData.rangeLongest.start)} -
                  {toGermanDate(streakData.rangeLongest.end)}</>}
                </Text>
              </Animated.View>

              <View style={{ height: 10 }}></View>

              <Animated.View style={[styles.card_container_wide,{transform: [{translateY: icon_slide}],
              opacity: icon_opacity}]}>
                <Text style={styles.card_label}>Aktuelle Pause</Text>
                <Text
                  style={[
                    styles.card_value,
                    { fontSize: 25 },
                    streakData.today
                      ? { color: "white" }
                      : { color: "#c4c4c4" },
                  ]}
                >
                  {streakData.currentBreak} Tage
                </Text>
                {!streakData.today ? (
                  <Text style={[styles.card_value, { fontSize: 20 }]}>
                    (seit {streakData.startCurrentBreak})
                  </Text>
                ) : null}
                <Text style={styles.card_label}>Längste Pause</Text>
                <Text style={[styles.card_value, { fontSize: 25 }]}>
                  {streakData.longestBreak} Tage
                </Text>
                <Text style={[styles.card_value2]}>
                  {streakData.rangeLongestBreak != null ? <>{toGermanDate(streakData.rangeLongestBreak.start)} -
                  {toGermanDate(streakData.rangeLongestBreak.end)}</> : null}
                </Text>
              </Animated.View>
            </>
          ) : null}

          <View style={{ height: 20 }}></View>

          </View>

          <View style={{ height: 30 }}></View>

          <Text style={styles.heading2}>Grafiken</Text>
          <View style={{ height: 10 }}></View>

          <SwitchSelector
            options={options_time}
            initial={0}
            onPress={(value) => toggleSelection(value)}
            textColor={"white"}
            backgroundColor={"#171717"}
            selectedColor={"white"}
            buttonColor={"#0080FF"}
            textStyle={{ fontFamily: "PoppinsLight", fontSize: 12}}
            selectedTextStyle={{ fontFamily: "PoppinsLight", fontSize: 12 }}
            style={{ width: "95%" }}
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
              borderRadius: 25
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
            width={Dimensions.get("window").width - 40} // from react-native
            height={250}
            yAxisInterval={1} // optional, defaults to 1
            verticalLabelRotation={20}
            chartConfig={{
              backgroundGradientFrom: "#121212",
              backgroundGradientTo: "#171717",
              decimalPlaces: 0, // optional, defaults to 2dp
              color: () =>  {return "rgba(255,255,255,0.35)"},
              labelColor: () =>  {return "rgba(255,255,255,0.5)"},
              propsForLabels: {
                fontSize: 8
              },
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
              borderRadius: 25
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
            width={Dimensions.get("window").width - 40}
            height={250}
            chartConfig={{
              backgroundGradientFrom: "#121212",
              backgroundGradientTo: "#171717",
              decimalPlaces: 0, // optional, defaults to 2dp
              color: () =>  {return "rgba(255,255,255,0.35)"},
              labelColor: () =>  {return "rgba(255,255,255,0.5)"},
            }}
          />

          {selectedType === "main" ? (
            <PieChart
              style={{
                marginVertical: 10,
                borderRadius: 25
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
                {
                  name: "Pfeife",
                  count: filterByMostRecent(
                    filterByType(localData, "pipe"),
                    selectedTime
                  ).length,
                  color: "#0080FF",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15,
                },
                {
                  name: "Edible",
                  count: filterByMostRecent(
                    filterByType(localData, "cookie"),
                    selectedTime
                  ).length,
                  color: "red",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15,
                },
              ]}
              width={Dimensions.get("window").width - 40}
              height={250}
              backgroundColor={"#171717"}
              chartConfig={{
                color: () =>  {return "rgba(255,255,255,0.35)"},
                labelColor: () =>  {return "rgba(255,255,255,0.5)"},
              }}
              accessor={"count"}
              paddingLeft={"15"}
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
    borderTopWidth: 2,
  },
  card_label: {
    color: "white",
    fontFamily: "PoppinsLight",
    fontSize: 14,
    marginTop: 5,
    textAlign: "left",
  },
  card_value: {
    color: "white",
    fontFamily: "PoppinsBlack",
    fontSize: 30,
    marginTop: -10,
    textAlign: "left",
  },
  card_value2: {
    color: "rgba(255,255,255,0.5)",
    fontFamily: "PoppinsLight",
    fontSize: 12,
    marginTop: -8,
    textAlign: "left",
    opacity: 0.75
  },
  card_container_wide: {
    backgroundColor: "#171717",
    margin: 10,
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
    alignSelf: "flex-start",
  },
  bong_img: {
    width: 35,
    height: 60,
    alignSelf: "center",
    position: "absolute",
    marginTop: 10,
    opacity: 1,
  },
  joint_img: {
    width: 20,
    height: 60,
    alignSelf: "center",
    position: "absolute",
    marginTop: 10,
    opacity: 1
  },
  vape_img: {
    width: 20,
    height: 60,
    alignSelf: "center",
    position: "absolute",
    marginTop: 10,
    opacity: 1,
  },
  pipe_img: {
    width: 45,
    height: 65,
    alignSelf: "center",
    position: "absolute",
    marginTop: 10,
    opacity: 1,
  },
  cookie_img: {
    width: 50,
    height: 50,
    alignSelf: "center",
    position: "absolute",
    marginTop: 10,
    opacity: 1,
  },
});
