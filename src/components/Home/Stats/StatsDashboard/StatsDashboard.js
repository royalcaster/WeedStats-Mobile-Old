//React
import React from "react";
import { useState, useEffect, useRef, useContext} from "react";
import { StyleSheet, View, Text, ScrollView, Dimensions, Animated, Easing, TouchableNativeFeedback } from "react-native";

//Custom Components
import History from "./History/History";
import Levels from "../../../../data/Levels.json";
import DailyAveragePanel from "./DailyAveragePanel/DailyAveragePanel";
import StatsCard from './StatsCard/StatsCard'

//Icons
import EvilIcons from 'react-native-vector-icons/EvilIcons'

//Tools
import toGermanDate from "../../../../data/DateConversion";

//Third Party
import SwitchSelector from "react-native-switch-selector";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";

//Service
import { calcDailyAverage, filterByType, filterByMostRecent, getEntryDates, getBreakDates, createLineChartData, createBarChartData, calcStreak } from "../../../../data/Service";
import StreakPanel from "./StreakPanel/StreakPanel";
import BreakPanel from "./BreakPanel/BreakPanel";

const StatsDashboard = ({ localData }) => {
  
  const [selectedType, setSelectedType] = useState("main");
  const [selectedTime, setSelectedTime] = useState(0);

  const [showHistory, setShowHistory] = useState(false);

  const icon_slide = useRef(new Animated.Value(-50)).current;
  const icon_opacity = useRef(new Animated.Value(1)).current;
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
  /* useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.bezier(0.07, 1, 0.33, 0.89),
    }).start();
  }, []); */

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

    <>

    {showHistory ? <History show={showHistory} onExit={() => setShowHistory(false)} history={localData}/> : null}

    <ScrollView style={styles.container}>
      <Animated.View style={{ opacity: 1, alignItems: "center"}}>
        <View style={{ height: 50 }}></View>
        <View style={{flexDirection: "row", width: "100%"}}>
        <Text style={styles.heading2}>Überblick</Text>
        <View style={{flexDirection: "row",right: 10, top: -10,position: "absolute"}}>
        <TouchableNativeFeedback
              background={TouchableNativeFeedback.Ripple("rgba(255,255,255,0.1)", true)}
              onPress={() => setShowHistory(true)}
            >
              <View
                style={[
                  styles.touchable,
                  { height: 50, backgroundColor: "#1E2132", width: 50 },
                ]}
              >
                <EvilIcons
                  name="clock"
                  style={{
                    color: "white",
                    fontSize: 30,
                    height: "100%",
                    textAlignVertical: "center",
                    alignSelf: "center"
                  }}
                />
              </View>
            </TouchableNativeFeedback>
            </View>
        </View>
        <View style={{ height: 20 }}></View>

        

        <View style={{ width: "95%"}}>
          <SwitchSelector
            options={options_type}
            initial={0}
            onPress={(value) => toggleSelection(value)}
            textColor={"white"}
            backgroundColor={"#131520"}
            selectedColor={"white"}
            buttonColor={"#0080FF"}
            textStyle={{ fontFamily: "PoppinsLight", fontSize: 12, height: "100%", width: "100%"}}
            selectedTextStyle={{ fontFamily: "PoppinsBlack", fontSize: 12}}
            style={{backgroundColor: "#131520", borderRadius: 10}}
            selectedTextContainerStyle={{borderRadius: 10, backgroundColor: "#0080FF", height: "100%", width: "100%"}}
          />
        </View>

        <View style={{ height: 30 }}></View>

        <View style={{ alignItems: "center", flex: 1 }}>

          <DailyAveragePanel 
            selectedType={selectedType} 
            value={Math.round(calcDailyAverage(filterByType(localData, selectedType), localData) * 100) / 100}
          />

          <View style={{ height: 30 }}></View>



          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-evenly"
            }}
          >

            <StatsCard title="Ø Woche" value={Math.round(
                  calcDailyAverage(filterByType(localData, selectedType), localData) *
                    7 *
                    10
                ) / 10}
            />

            <StatsCard title="Ø Monat" value={Math.round(
                  calcDailyAverage(filterByType(localData, selectedType), localData) *
                    30.5 *
                    10
                ) / 10}
            />

            <StatsCard title="Ø Jahr" value={Math.round(
                  calcDailyAverage(filterByType(localData, selectedType), localData) * 365
                )}
            />
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
              justifyContent: "space-evenly"
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
                    textAlign: "center"
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
                    textAlign: "center"
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
                    textAlign: "center"
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
          
          
          {selectedType === "main" ? (
            <>
              <StreakPanel 
                streakData={streakData}
                currentStreak={streakData.currentStreak}
                currentStreakStart={streakData.within ? streakData.startCurrent: null}
                longestStreak={streakData.longestStreak}
                longestStreakStart={toGermanDate(streakData.rangeLongest.start)}
                longestStreakEnd={toGermanDate(streakData.rangeLongest.end)}
              />

              <View style={{ height: 10 }}></View>

              <BreakPanel 
                streakData={streakData}
                currentBreak={streakData.currentBreak}
                currentBreakStart={streakData.startCurrentBreak}
                longestBreak={streakData.longestBreak}
                longestBreakStart={toGermanDate(streakData.rangeLongestBreak.start)}
                longestBreakEnd={toGermanDate(streakData.rangeLongestBreak.end)}
              />
            </>
          ) : null}

          <View style={{ height: 30 }}></View>

          <Text style={styles.heading2}>Grafiken</Text>
          <View style={{ height: 10 }}></View>

          <SwitchSelector
            options={options_time}
            initial={0}
            onPress={(value) => toggleSelection(value)}
            textColor={"white"}
            backgroundColor={"#131520"}
            selectedColor={"white"}
            buttonColor={"#0080FF"}
            textStyle={{ fontFamily: "PoppinsLight", fontSize: 12, height: "100%", width: "100%"}}
            selectedTextStyle={{ fontFamily: "PoppinsBlack", fontSize: 12}}
            style={{backgroundColor: "#131520", borderRadius: 10, width: "95%"}}
            selectedTextContainerStyle={{borderRadius: 10, backgroundColor: "#0080FF", height: "100%", width: "100%"}}
          />

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
              backgroundGradientFrom: "#131520",
              backgroundGradientTo: "#131520",
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
              backgroundGradientFrom: "#131520",
              backgroundGradientTo: "#131520",
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
                  color: Levels[0].colors[0],
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15,
                },
                {
                  name: "Bong",
                  count: filterByMostRecent(
                    filterByType(localData, "bong"),
                    selectedTime
                  ).length,
                  color: Levels[1].colors[0],
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15,
                },
                {
                  name: "Vape",
                  count: filterByMostRecent(
                    filterByType(localData, "vape"),
                    selectedTime
                  ).length,
                  color: Levels[2].colors[0],
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15,
                },
                {
                  name: "Pfeife",
                  count: filterByMostRecent(
                    filterByType(localData, "pipe"),
                    selectedTime
                  ).length,
                  color: Levels[3].colors[0],
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15,
                },
                {
                  name: "Edible",
                  count: filterByMostRecent(
                    filterByType(localData, "cookie"),
                    selectedTime
                  ).length,
                  color: Levels[4].colors[0],
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15,
                },
              ]}
              width={Dimensions.get("window").width - 40}
              height={250}
              backgroundColor={"#131520"}
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
    </>
  );
};

export default StatsDashboard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E2132",
    width: "100%",
  },
  heading: {
    fontFamily: "PoppinsBlack",
    color: "#c4c4c4",
    fontSize: 20,
    marginLeft: 10,
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
    backgroundColor: "#131520",
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
  }
});
