//React
import React from "react";
import { Animated, StyleSheet, View, Text, Image } from "react-native";

//Third Party
import AppIntroSlider from 'react-native-app-intro-slider';

const Tutorial = ({ onDone, extraHeight }) => {

    const renderItem = ({ item }) => {
        return (
          <View style={{flexDirection: "column", height: "100%"}}>

            <View style={{height: extraHeight}}></View>

            <View style={{flex: 1}}>
              <Text style={{color: "white", fontFamily: "PoppinsBlack", fontSize: 25, textAlign: "center"}}>{item.title}</Text>
            </View>
    
            {item.image ? 
            <View style={{flex: 3}}>
              <Image source={item.image} style={{height: "100%", width: "55%", borderRadius: 25, alignSelf: "center"}}/>
            </View> : null}
    
            <View style={{flex: 4}}>
              <Text style={{color: "white", fontFamily: "PoppinsLight", fontSize: 15, marginLeft: 30, textAlign: "center", maxWidth: "80%", marginTop: 20}}>{item.text}</Text>
            </View>
            
          </View>
        );
      }

      const slides = [
        {
          key: 'zero',
          title: 'Willkommen',
          text: 'WeedStats bietet verschiedenste Möglichkeiten zum Erfassen, Auswerten und Teilen deines Gras-Konsums. \n\nDiese kurze Tour wird dir die wesentlichen Funktionen der App beibringen.',
          backgroundColor: '#0080FF',
        },
        {
          key: 'one',
          title: 'Counter',
          text: 'Jedes mal, wenn du etwas rauchst, solltest du den jeweiligen Counter um eins erhöhen. Halte dazu den Button für kurze Zeit gedrückt.\n\n Je nach Einstellung wird der Zeitpunkt und die aktuellen GPS-Daten gespeichert.',
          image: require('../../data/img/screenshots/counter.png'),
          backgroundColor: '#0080FF',
        },
        {
          key: 'two',
          title: 'Stats',
          text: 'Hier findest du sowohl statistische Auswertungen und Diagramme zu deinem Konsum als auch eine Liste deiner letzten Einträge.',
          image: require('../../data/img/screenshots/stats.png'),
          backgroundColor: '#0080FF',
        },
        {
          key: 'three',
          title: 'Map',
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
    }
});