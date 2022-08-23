//React
import React, { useState } from "react";
import { Animated, StyleSheet, View, Text, Image } from "react-native";

//Third Party
import AppIntroSlider from 'react-native-app-intro-slider';
import { LinearGradient } from "expo-linear-gradient";

//Custom Components
import CounterItem from "../Home/Main/CounterItem/CounterItem";
import StatsCard from "../Home/Stats/StatsDashboard/StatsCard/StatsCard";
import StreakPanel from "../Home/Stats/StatsDashboard/StreakPanel/StreakPanel";

const Tutorial = ({ onDone, extraHeight }) => {

    const [testCounter, setTestCounter] = useState(69);

    const renderItem = ({ item }) => {
        return (
          <View style={{flexDirection: "column", height: "100%"}}>

            <View style={{height: extraHeight}}></View>
  
            <View style={{height: "100%"}}>
            {item.testComponent ? item.testComponent : null}
            </View>
            
            <LinearGradient colors={["rgba(0,0,0,0)", "#1E2132"]} style={styles.blur_container}>
              <LinearGradient colors={["#369bff","#0080FF","#004e9c"]} style={styles.info_container}>
                <Text style={styles.info_title}>{item.title}</Text>
                <View style={{height: "5%"}}></View>
                <Text style={styles.info_text}>{item.text}</Text>
              </LinearGradient>
            </LinearGradient>

          </View>
        );
      }

      const welcomeTest = () => {
        return <View>
          <Image style={{height: 100, width: 100, alignSelf: "center", borderRadius: 15}} source={require('../../../assets/icon.png')}/>
          <View style={{height: 20}}></View>
          <Text style={styles.logo_heading}>WeedStats</Text>
        </View>

        
      }
      
      const counterTest = () => {
        return <View>
        <CounterItem type={"joint"} counter={testCounter} toggleCounter={() => setTestCounter(testCounter+1)}/>
        <CounterItem type={"joint"} counter={testCounter} toggleCounter={() => setTestCounter(testCounter+1)}/>
        <CounterItem type={"joint"} counter={testCounter} toggleCounter={() => setTestCounter(testCounter+1)}/>
      </View>
    }

    const statsTest = () => {
      return <View>
        <StatsCard title={"Ø Tag"} value={3}/>
        <StatsCard title={"Ø Woche"} value={17}/>
        <StatsCard title={"Ø Monat"} value={48}/>

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
                  { marginTop: 0, textAlign: "center"},
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
              >49
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
              >23
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
                30
              </Animated.Text>
            </View>
          </View>

      </View>
    }

      const slides = [
        {
          key: 'zero',
          title: 'Willkommen',
          text: 'WeedStats bietet verschiedenste Möglichkeiten zum Erfassen, Auswerten und Teilen deines Gras-Konsums. \n\nDiese kurze Tour wird dir die wesentlichen Funktionen der App beibringen.',
          testComponent: welcomeTest()
        },
        {
          key: 'one',
          title: 'Counter',
          text: 'Jedes mal, wenn du etwas rauchst, solltest du den jeweiligen Counter um eins erhöhen. Halte dazu den Button für kurze Zeit gedrückt.\n\n Je nach Einstellung wird der Zeitpunkt und die aktuellen GPS-Daten gespeichert.\n\nMit der Zeit arbeitest du dich durch alle WeedStats-Level. Probier es oben aus!',
          image: require('../../data/img/screenshots/counter.png'),
          testComponent: counterTest()
        },
        {
          key: 'two',
          title: 'Stats',
          text: 'Hier findest du statistische Auswertungen zu deinem Konsum und deinen Rauch-Verlauf.',
          image: require('../../data/img/screenshots/stats.png'),
          testComponent: statsTest()
        },
        {
          key: 'three',
          title: 'WeedMap',
          text: 'Die Karte kann dir entweder eine Heatmap mit den Orten zeigen, an denen du am häufigsten geraucht hast, oder auch die letzten Einträge deiner Freunde.',
          image: require('../../data/img/screenshots/map.png'),
          backgroundColor: '#0080FF',
        },
        {
          key: 'four',
          title: 'Einstellungen',
          text: 'Hier kannst du Einstellungen für deine Privatsphäre und die Anzeige treffen.',
          image: require('../../data/img/screenshots/config.png'),
          backgroundColor: '#0080FF',
        },
        {
          key: 'five',
          title: 'Freunde',
          text: 'Füge Freunde hinzu, um deine Statistiken mit ihnen zu teilen und das volle Potential von WeedStats auszuschöpfen!\n\nAußerdem kannst du hier auf deinen Account zugreifen.',
          image: require('../../data/img/screenshots/friends.png'),
          backgroundColor: '#0080FF',
        },
        {
          key: 'six',
          title: 'Unser Tipp',
          text: 'Hier eventuell Hinweis auf Intention der App, keine Anregung zu Konsum, kein Konsum bei minderjährigen! \n\nJe gewissenhafter du deinen Konsum in der App einträgst, desto genauer werden deine Statistiken mit der Zeit.\n\nWir wünschen dir viel Spaß mit WeedStats!',
          backgroundColor: '#0080FF',
        }
      ];

    return (
        <Animated.View style={styles.container}>
            <AppIntroSlider renderItem={renderItem} data={slides} onDone={onDone}/>
            <View style={{height: extraHeight}}></View>
        </Animated.View>
    );
}

export default Tutorial

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#131520",
        height: "100%",
        width: "100%"
    },
    info_container: {
      backgroundColor: "blue",
      margin: "15%",
      marginHorizontal: "5%",
      borderRadius: 10,
      position: "absolute",
      bottom: 20,
      alignSelf: "center",
      padding: "5%"
    },
    info_title: {
      color: "white", 
      fontFamily: "PoppinsBlack",
      fontSize: 25,
      textAlign: "left",
    },
    info_text: {
      color: "white",
      fontFamily: "PoppinsLight",
      fontSize: 15,
      textAlign: "left"
    },
    logo_heading: {
      fontFamily: "PoppinsBlack",
      fontSize: 30,
      color: "white",
      textAlign: "center"
    },
    blur_container: {
      position: "absolute",
      alignSelf: "center",
      width: "100%",
      height: "50%",
      bottom: 0
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
});