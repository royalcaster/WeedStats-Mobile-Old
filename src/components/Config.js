import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { TextInputBase, View } from "react-native";
import { useFonts } from "expo-font";
import {
  StyleSheet,
  Text,
  Animated,
  TextInput,
  Image,
  ScrollView,
  Modal
} from "react-native"

import Levels from './Levels'

import Button from "./Button"

import ConfigItem from "./ConfigItem"

import FontAwesome from 'react-native-vector-icons/FontAwesome'

import Toggle from 'react-native-toggle-element';

const Config = ({ statConfig, toggleConfig }) => {

  const [showLevels, setShowLevels] = useState(false);
  const hideLevels = () => {
    setShowLevels(false);
  }

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [lightmode, setLightMode] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const [loaded] = useFonts({
    PoppinsBlack: require("./fonts/Poppins-Black.ttf"),
    PoppinsLight: require("./fonts/Poppins-Light.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <>
    {showLevels ? <Levels onexit={hideLevels}></Levels> :
    
    <Animated.View style={[{ opacity: fadeAnim }, styles.container]}>

              <Modal 
                animationType="fade"
                transparent={true}
                visible={lightmode}>
                <View style={{alignItems: "center", justifyContent: "center", backgroundColor:"rgba(0,0,0,0.5)", flex: 1}}>

                    <View style={{width: "90%", height: 300, backgroundColor: "#171717", alignSelf: "center", borderRadius: 25}}>
                        <View style={{flex: 1}}>
                            <Text style={[styles.heading,{marginLeft: 0, textAlign: "center", height: "100%", textAlignVertical: "center", fontSize: 22}]}>Ist alles gut?</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={[styles.text,{fontSize: 15}]}>Uns ist aufgefallen, dass du den Lightmode aktivieren wolltest.
                            Um dich und deine Mitmenschen zu schützen, lassen wir ihn ausgeschaltet.</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Button title={"Danke!"} color={"#0080FF"} borderradius={25} fontColor={"white"} onPress={() => setLightMode(false)}/>
                        </View>
                    </View>
                </View>
            </Modal>
      
      <View style={{height: 50}}></View>
        <ScrollView style={{width: "100%", flex: 1}}>

          <Text style={styles.heading}>Ansicht konfigurieren</Text>

            <View style={{flexDirection: "row", width: "100%",}}>
              <ConfigItem
                type="joint"
                config={statConfig.joint}
                onToggle={toggleConfig}
              ></ConfigItem>
              <ConfigItem
                type="bong"
                config={statConfig.bong}
                onToggle={toggleConfig}
              ></ConfigItem>
              <ConfigItem
                type="vape"
                config={statConfig.vape}
                onToggle={toggleConfig}
              ></ConfigItem>
            </View>


          <View style={{height: 20}}></View>

          <View style={{flexDirection: "row", height: 50, width: "95%", alignContent: "center"}}>
            <View style={{flex: 4}}>
              <Text style={styles.label}>Lightmode</Text>
            </View>
            <View style={{flex: 1, alignItems: "center"}}>
            
              <Toggle 
                value={lightmode} 
                onPress={(val) => setLightMode(val)} 
                trackBar={{
                  activeBackgroundColor: "#0080FF",
                  inActiveBackgroundColor: "#171717",
                  width: 50,
                  height: 25
                }}
                thumbButton={{inActiveBackgroundColor: "white", activeBackgroundColor: "white", height: 25, width: 25}}
              />

            </View>
          </View>

          <View style={{height: 20}}></View>

          <Text style={styles.heading}>Persönliche Daten</Text>
          <View style={{height: 10}}></View>

          <View style={{flexDirection: "row", height: 50, width: "95%", alignContent: "center"}}>
            <View style={{flex: 4}}>
              <Text style={styles.label}>Aktivitätsdetails speichern</Text>
            </View>
            <View style={{flex: 1, alignItems: "center"}}>
            
              <Toggle 
                value={true} 
                onPress={(val) => console.log(val)} 
                trackBar={{
                  activeBackgroundColor: "#0080FF",
                  inActiveBackgroundColor: "#171717",
                  width: 50,
                  height: 25
                }}
                thumbButton={{inActiveBackgroundColor: "white", activeBackgroundColor: "white", height: 25, width: 25}}
              />

            </View>
          </View>

          <View style={{flexDirection: "row", height: 50, width: "95%", alignContent: "center"}}>
            <View style={{flex: 4}}>
              <Text style={styles.label}>Aktivitäten für Freunde sichtbar machen</Text>
            </View>
            <View style={{flex: 1, alignItems: "center"}}>
            
              <Toggle 
                value={true} 
                onPress={(val) => console.log(val)} 
                trackBar={{
                  activeBackgroundColor: "#0080FF",
                  inActiveBackgroundColor: "#171717",
                  width: 50,
                  height: 25
                }}
                thumbButton={{inActiveBackgroundColor: "white", activeBackgroundColor: "white", height: 25, width: 25}}
              />

            </View>
          </View>

          <View style={{flexDirection: "row", height: 50, width: "95%", alignContent: "center"}}>
            <View style={{flex: 4}}>
              <Text style={styles.label}>Aktivitäten auf der Karte sichtbar machen</Text>
            </View>
            <View style={{flex: 1, alignItems: "center"}}>
            
              <Toggle 
                value={true} 
                onPress={(val) => console.log(val)} 
                trackBar={{
                  activeBackgroundColor: "#0080FF",
                  inActiveBackgroundColor: "#171717",
                  width: 50,
                  height: 25
                }}
                thumbButton={{inActiveBackgroundColor: "white", activeBackgroundColor: "white", height: 25, width: 25}}
              />

            </View>
          </View>

          <View style={{height: 30}}></View>
          <Button fontColor={"white"} onPress={() => setShowLevels(true)} borderradius={100} color={"#4a4a4a"} title={" Levelübersicht"} icon={<FontAwesome name="trophy" style={styles.money_icon} />}/>
        </ScrollView>
    
    </Animated.View>}
    </>
  );
};

export default Config;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1E1E1E",
    marginTop: 0,
    justifyContent: "center",
  },
  config_text: {
    color: "white",
    fontFamily: "PoppinsLight",
    fontSize: 18,
    alignSelf: "center",
  },
  config_container: {
    flexDirection: "row",
    marginTop: 20,
  },
  switch: {
    marginLeft: 20,
    paddingLeft: 20,
  },
  signOutButton: { 
    width: "80%",
    alignSelf: "center",
    height: 50,
    borderRadius: 100,
    justifyContent: "center",
    marginTop: 20,
    bottom: 20,
    flexDirection: "row"
  },
  money_icon: {
    fontSize: 25,
    color: "white",
    textAlignVertical: "center"
  },
  heading: {
    color: "white",
    fontSize: 20,
    fontFamily: "PoppinsBlack",
    marginLeft: 20
  },
  image: {
    width: 15,
    height: 50,
    alignSelf: "center"
  },
  input: {
    height: "100%",
    width: "100%",
    backgroundColor: "#171717",
    borderRadius: 100,
    paddingLeft: 20,
    fontSize: 18,
    color: "rgba(255,255,255,0.75)",
    fontFamily: "PoppinsBlack"
  },
  label: {
    color: "white",
    fontSize: 15,
    fontFamily: "PoppinsLight",
    marginLeft: 20
  },
  text: {
    alignSelf: "center",
    fontFamily: "PoppinsLight",
    fontSize: 18,
    color: "white",
    maxWidth: 250,
    textAlign: "center"
},
});
