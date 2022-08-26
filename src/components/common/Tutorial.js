//React
import React, { useState } from "react";
import { Animated, StyleSheet, View, Text, Image, Dimensions } from "react-native";

//Third Party
import AppIntroSlider from 'react-native-app-intro-slider';
import { LinearGradient } from "expo-linear-gradient";
import PieChart from "react-native-chart-kit/dist/PieChart";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

//Custom Components
import CounterItem from "../Home/Main/CounterItem/CounterItem";
import ConfigItem from "../Home/Config/ConfigItem/ConfigItem";
import FriendListItem from "../Home/Friends/FriendList/FriendListItem/FriendListItem";

//Konstanten
import Levels from '../../data/Levels.json'
import { mapStyle } from "../../data/CustomMapStyle";

const Tutorial = ({ onDone, extraHeight }) => {

    const [testCounter, setTestCounter] = useState(68);
    const [testCounter2, setTestCounter2] = useState(206);

    const [config, setConfig ] = useState({
      joint: true,
      bong: false,
      vape: true,
      cookie: true,
      edible: false
    });

    const renderItem = ({ item }) => {
        return (
          <View style={{flexDirection: "column", height: "100%"}}>

            <View style={{height: extraHeight}}></View>
  
            <View style={{height: "100%"}}>
            {item.testComponent ? item.testComponent : null}
            </View>
            
            <LinearGradient colors={["rgba(0,0,0,0)", "#131520"]} style={styles.blur_container}>
              <LinearGradient colors={["#369bff","#0080FF","#004e9c"]} style={styles.info_container}>
                <View style={{flexDirection: "row"}}>
                {item.icon ? item.icon : null}
                <Text style={styles.info_title}>{item.title}</Text>
                </View>                
                <View style={{height: "5%"}}></View>
                <Text style={styles.info_text}>{item.text}</Text>
              </LinearGradient>
            </LinearGradient>

          </View>
        );
      }

      const welcomeTest = () => {
        return <View style={{backgroundColor: "#131520", width: "90%", alignSelf: "center", paddingVertical: 25, borderRadius: 10}}>
          <Image style={{height: 100, width: 100, alignSelf: "center", borderRadius: 15}} source={require('../../../assets/icon.png')}/>
          <View style={{height: 20}}></View>
          <Text style={styles.logo_heading}>WeedStats</Text>
        </View>

        
      }
      
      const counterTest = () => {
        return <View>
        <CounterItem type={"joint"} counter={testCounter} toggleCounter={() => setTestCounter(testCounter+1)}/>
        <CounterItem type={"bong"} counter={testCounter2} toggleCounter={() => setTestCounter2(testCounter2+1)}/>
      </View>
    }

    const statsTest = () => {
      return <View style={{alignItems: "center"}}>
        <PieChart
              style={{
                marginVertical: 10,
                borderRadius: 25
              }}
              data={[
                {
                  name: "Joint",
                  count: 5,
                  color: Levels[0].colors[0],
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15,
                },
                {
                  name: "Bong",
                  count: 4,
                  color: Levels[1].colors[0],
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15,
                },
                {
                  name: "Vape",
                  count: 3,
                  color: Levels[2].colors[0],
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15,
                },
                {
                  name: "Pfeife",
                  count: 2,
                  color: Levels[3].colors[0],
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15,
                },
                {
                  name: "Edible",
                  count: 1,
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
      </View>
    }

    const mapTest = () => {
      return <View style={{height: "100%", width: "100%"}}>

            <LinearGradient colors={["#1E2132", "rgba(0,0,0,0)"]} style={{position: "absolute", top: 0, width: "100%", height: 100, zIndex: 2}}>
            </LinearGradient>

          <MapView
            provider={PROVIDER_GOOGLE}
            style={[{ height: Dimensions.get("window").height }, styles.map]}
            customMapStyle={mapStyle}
            showsUserLocation={true}
            mapType={"standard"}
            followsUserLocation={true}
            showsCompass={false}
            showsTraffic={false}
            showsIndoors={false}
            pitchEnabled={true}
            showsMyLocationButton={false}
            loadingEnabled={true}
            loadingBackgroundColor={"#131520"}
            loadingIndicatorColor={"#484F78"}
          >
          </MapView>
      </View>
    }

    const configTest = () => {
      return <View style={{flex: 1, backgroundColor: "#1E2132"}}>

        <View style={{flexDirection: "row", width: "100%", height: 180}}>

          <View style={{flex: 1}}>
            <ConfigItem
                type="joint"
                config={config.joint}
                onToggle={() => {
                  setConfig({ ...config, joint: !config.joint });
                }}
            />
          </View>

          <View style={{flex: 1}}>
            <ConfigItem
                type="bong"
                config={config.bong}
                onToggle={() => {
                  setConfig({ ...config, bong: !config.bong });
                }}
            />
          </View>

          <View style={{flex: 1}}>
            <ConfigItem
                type="vape"
                config={config.vape}
                onToggle={() => {
                  setConfig({ ...config, vape: !config.vape });
                }}
            />
          </View>
          

        </View>

        <View style={{flexDirection: "row", width: "80%", height: 180, alignSelf: "center"}}>

          <View style={{flex: 1}}>
            <ConfigItem
                type="joint"
                config={config.cookie}
                onToggle={() => {
                  setConfig({ ...config, cookie: !config.cookie });
                }}
            />
          </View>

          <View style={{flex: 1}}>
            <ConfigItem
                type="bong"
                config={config.edible}
                onToggle={() => {
                  setConfig({ ...config, edible: !config.edible });
                }}
            />
          </View>
        </View>
      </View>
    }

    const friendsTest = () => {
      return <View>

      <Text style={styles.heading}>Freunde</Text>

      <FriendListItem userid={"116462348102905579382"} onPress={() => {return null}}/>
      <FriendListItem userid={"115588503617039740769"} onPress={() => {return null}}/>
      <FriendListItem userid={"114731570836078840175"} onPress={() => {return null}}/>

      </View>
    }

    const tippTest = () => {
      return <View style={{width: "100%", alignSelf: "center"}}>

      <LinearGradient colors={["#FC2044", "#B31731"]} style={[styles.info_container, {position: "relative"}]}>
          <Text style={styles.info_title}>Achtung</Text>
          <Text style={styles.info_text}>Hier Hinweis auf Intention der App, keine Anregung zu Konsum, kein Konsum bei minderjährigen!
          Auch Verlinkung zu medizinischen Risiken, Hilfs-Hotlines, die App soll spaß machen, aber Verantwortungsvoller Konsum steht an oberster Priorität! {"\n"}...{"\n"}...{"\n"}...{"\n"}...{"\n"}...{"\n"}...{"\n"}...{"\n"}...{"\n"}...{"\n"}...{"\n"}...</Text>
      </LinearGradient>

      </View>
    }

      const slides = [
        {
          key: 'zero',
          title: 'Willkommen',
          text: 'WeedStats bietet verschiedenste Möglichkeiten zum Erfassen, Auswerten und Teilen deines Gras-Konsums. \n\nDiese kurze Tour wird dir die wesentlichen Funktionen der App beibringen.',
          testComponent: welcomeTest(),
        },
        {
          key: 'one',
          title: 'Counter',
          text: 'Jedes mal, wenn du etwas rauchst, solltest du den jeweiligen Counter um eins erhöhen. Halte dazu den Button für kurze Zeit gedrückt.',
          image: require('../../data/img/screenshots/counter.png'),
          testComponent: counterTest(),
          icon: <Image source={require("../../data/img/logo_w.png")} style={styles.counter_image}/>
        },
        {
          key: 'two',
          title: 'Stats',
          text: 'Hier findest du statistische Auswertungen zu deinem Konsum und deinen Rauch-Verlauf.',
          image: require('../../data/img/screenshots/stats.png'),
          testComponent: statsTest(),
          icon: <Entypo name="area-graph" style={styles.icon}/>
        },
        {
          key: 'three',
          title: 'WeedMap',
          text: 'Die Karte kann dir entweder eine Heatmap mit den Orten zeigen, an denen du am häufigsten geraucht hast, oder auch die letzten Aktivitäten deiner Freunde.',
          image: require('../../data/img/screenshots/map.png'),
          testComponent: mapTest(),
          icon: <FontAwesome name="map-marker" style={styles.icon}/>
        },
        {
          key: 'four',
          title: 'Einstellungen',
          text: 'Hier kannst du Einstellungen für deine Privatsphäre und die Anzeige treffen.',
          image: require('../../data/img/screenshots/config.png'),
          testComponent: configTest(),
          icon: <FontAwesome name="sliders" style={styles.icon}
        />
        },
        {
          key: 'five',
          title: 'Freunde',
          text: 'Füge Freunde hinzu, um deine Statistiken mit ihnen zu teilen und das volle Potential von WeedStats auszuschöpfen!\n\nAußerdem kannst du hier auf deinen Account zugreifen.',
          image: require('../../data/img/screenshots/friends.png'),
          testComponent: friendsTest(),
          icon: <FontAwesome name="user" style={styles.icon}/>
        },
        {
          key: 'six',
          title: 'Unser Tipp',
          text: 'Je gewissenhafter du deinen Konsum in der App einträgst, desto genauer werden deine Statistiken mit der Zeit. Wenn du schummelst, brauchst du die App nicht!\n\nWir wünschen dir viel Spaß mit WeedStats!',
          testComponent: tippTest()
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
        backgroundColor: "#1E2132",
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
      fontSize: 20,
      textAlign: "left",
    },
    info_text: {
      color: "white",
      fontFamily: "PoppinsLight",
      fontSize: 13,
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
    map: {
      width: "100%",
      position: "relative",
      top: -20,
      backgroundColor: "#171717",
      height: "100%"
    },
    heading: {
      fontFamily: "PoppinsBlack",
      color: "white",
      fontSize: responsiveFontSize(2.3),
      marginLeft: 30
    },
    icon: {
      color: "white",
      fontSize: 20,
      textAlignVertical: "center",
      marginRight: 5,
      marginTop: -5
    },
    counter_image: {
      height: responsiveHeight(3.5),
      width: responsiveHeight(3.5),
      marginTop: -2
    }
});