//React
import React from "react";
import { StyleSheet, Text, View, Animated, Dimensions } from "react-native";
import StateBar from "../StateBar/StateBar";

const StreakPanel = ({ streakData, currentStreak, currentStreakStart, longestStreak, longestStreakStart, longestStreakEnd }) => {
    return (
        <Animated.View style={[styles.card_container_wide,{width: Dimensions.get("window").width - 100}]}>

            <View style={styles.cosmetic}></View>

            <View style={styles.card_container_half}>
              <View style={{flexDirection: "row", width: "100%"}}>
                <Text style={styles.card_label}>Aktueller Streak</Text>
                <Text style={[styles.card_value2]}>seit {currentStreakStart}</Text>
              </View>
                
                <Text
                  style={[
                    styles.card_value,
                    streakData.today
                      ? { color: "white" }
                      : { color: "#8a8a8a" },
                  ]}
                >
                  {currentStreak} {currentStreak == 1 ? <Text style={{fontSize: 15}}>TAG</Text> : <Text style={{fontSize: 15}}>TAGE</Text>}
                </Text>
                <StateBar type={"streak"} value={currentStreak}/>

            </View>
            <View style={styles.card_container_half}>
                <View style={{width: "100%", flexDirection: "row"}}>
                  <Text style={styles.card_label}>Längster Streak</Text>
                  <Text style={[styles.card_value2]}>{longestStreakStart} - {longestStreakEnd}</Text>
                </View>
                <Text style={styles.card_value}>
                {longestStreak} {longestStreak == 1 ? <Text style={{fontSize: 15}}>TAG</Text> : <Text style={{fontSize: 15}}>TAGE</Text>}
                </Text>
            </View>
        </Animated.View>
    )
}

export default StreakPanel

const styles = StyleSheet.create({
    card_label: {
        color: "white",
        fontFamily: "PoppinsLight",
        fontSize: 11,
        textAlign: "left",
      },
      card_value: {
        color: "white",
        fontFamily: "PoppinsBlack",
        fontSize: 22,
        marginTop: -7,
        textAlign: "left",
      },
      card_value2: {
        color: "#484F78",
        fontFamily: "PoppinsLight",
        fontSize: 11,
        position: "absolute",
        right: 0
      },
      card_container_wide: {
        backgroundColor: "#131520",
        margin: 10,
        borderRadius: 10,
        borderTopColor: "#0080FF",
        borderTopWidth: 0
      },
      card_container_half: {
        padding: 15,
        flex: 1
      },
      cosmetic: {
        width: "90%",
        height: 10,
        backgroundColor: "#1E2132",
        opacity: 0.5,
        alignSelf: "center",
        marginTop: 10,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        borderRadius: 5
      }
});