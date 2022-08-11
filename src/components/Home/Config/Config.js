//React
import React, { useState, useEffect, useRef } from "react";
import {
  Dimensions,
  View,
  LogBox,
  StyleSheet,
  Text,
  Animated,
  ScrollView,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Custom Components
import Button from "../../common/Button";
import ConfigItem from "./ConfigItem/ConfigItem";
import CustomLoader from "../../common/CustomLoader";

//Thirt Party
import Toggle from "react-native-toggle-element";
import {
  responsiveHeight,
  responsiveFontSize
} from "react-native-responsive-dimensions";

const Config = () => {

  const [config, setConfig] = useState();
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(true);
  const [lightmode, setLightMode] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadSettings();
    LogBox.ignoreAllLogs();
  }, []);

  const loadSettings = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("settings");
      jsonValue != null ? setConfig(JSON.parse(jsonValue)) : null;
    } catch (e) {
      console.log("Error in Config beim Laden: ", e);
    }
    setLoading(false);
  };

  const storeSettings = async () => {
    try {
      const jsonValue = JSON.stringify(config);
      await AsyncStorage.setItem("settings", jsonValue);
    } catch (e) {
      console.log("Error in Config beim Speichern: ", e);
    }
    setLoading(false);
    setSaved(true);
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <>
      <Animated.View style={[{ opacity: fadeAnim }, styles.container]}>
        <Modal animationType="fade" transparent={true} visible={lightmode}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
              flex: 1,
              height: Dimensions.get("screen").height,
              top: 0,
              zIndex: 1000
            }}
          >
            <View style={{flex:1, justifyContent: "flex-start"}}></View>
            <View
              style={{
                width: "90%",
                backgroundColor: "#1E2132",
                alignSelf: "center",
                borderRadius: 25,
                height: "50%"
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.heading,
                    {
                      marginLeft: 0,
                      textAlign: "center",
                      height: "100%",
                      textAlignVertical: "center",
                      fontSize: responsiveFontSize(2.5),
                    },
                  ]}
                >
                  Ist alles gut?
                </Text>
              </View>
              <View style={{ flex: 2 }}>
                <Text style={[styles.text, { fontSize: responsiveFontSize(1.8) }]}>
                  Uns ist aufgefallen, dass du den Lightmode aktivieren
                  wolltest. Um dich und deine Mitmenschen zu schützen, lassen
                  wir ihn ausgeschaltet.
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  title={"Danke!"}
                  color={"#0080FF"}
                  borderradius={25}
                  fontColor={"white"}
                  onPress={() => setLightMode(false)}
                />
              </View>
            </View>
            <View style={{flex:1, justifyContent: "flex-end"}}></View>
          </View>
        </Modal>

        <View style={{ height: responsiveHeight(7) }}></View>

        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <CustomLoader x={80}/>
          </View>
        ) : (
          <ScrollView style={{ width: "100%", flex: 1 }}>
            <Text style={styles.heading}>Ansicht konfigurieren</Text>

            <View style={{ flexDirection: "row", width: "100%" }}>
              <ConfigItem
                type="joint"
                config={config.showJoint}
                onToggle={() => {
                  setConfig({ ...config, showJoint: !config.showJoint });
                  setSaved(false);
                }}
              ></ConfigItem>
              <ConfigItem
                type="bong"
                config={config.showBong}
                onToggle={() => {
                  setConfig({ ...config, showBong: !config.showBong });
                  setSaved(false);
                }}
              ></ConfigItem>
              <ConfigItem
                type="vape"
                config={config.showVape}
                onToggle={() => {
                  setConfig({ ...config, showVape: !config.showVape });
                  setSaved(false);
                }}
              ></ConfigItem>
            </View>
            <View
              style={{
                flexDirection: "row",
                width: "80%",
                alignSelf: "center",
                marginTop: -20,
              }}
            >
              <ConfigItem
                type="pipe"
                config={config.showPipe}
                onToggle={() => {
                  setConfig({ ...config, showPipe: !config.showPipe });
                  setSaved(false);
                }}
              ></ConfigItem>
              <ConfigItem
                type="cookie"
                config={config.showCookie}
                onToggle={() => {
                  setConfig({ ...config, showCookie: !config.showCookie });
                  setSaved(false);
                }}
              ></ConfigItem>
            </View>

            <Text style={styles.heading}>Persönliche Daten</Text>
            <View style={{ height: 10 }}></View>

            <View
              style={{
                flexDirection: "row",
                height: 50,
                width: "95%",
                alignContent: "center",
              }}
            >
              <View style={{ flex: 4, justifyContent: "center" }}>
                <Text style={styles.label}>Gesamt-Counter teilen</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Toggle
                  value={config.shareMainCounter}
                  onPress={() => {
                    setConfig({
                      ...config,
                      shareMainCounter: !config.shareMainCounter,
                    });
                    setSaved(false);
                  }}
                  trackBar={{
                    activeBackgroundColor: "#0080FF",
                    inActiveBackgroundColor: "#131520",
                    width: 50,
                    height: 25,
                  }}
                  thumbButton={{
                    inActiveBackgroundColor: "white",
                    activeBackgroundColor: "white",
                    height: 25,
                    width: 25,
                  }}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                height: 50,
                width: "95%",
                alignContent: "center",
              }}
            >
              <View style={{ flex: 4, justifyContent: "center" }}>
                <Text style={styles.label}>Detail-Counter teilen</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Toggle
                  disabled={!config.shareMainCounter}
                  value={config.shareTypeCounters}
                  onPress={() => {
                    setConfig({
                      ...config,
                      shareTypeCounters: !config.shareTypeCounters,
                    });
                    setSaved(false);
                  }}
                  trackBar={{
                    activeBackgroundColor: "#0080FF",
                    inActiveBackgroundColor: "#131520",
                    width: 50,
                    height: 25,
                  }}
                  thumbButton={{
                    inActiveBackgroundColor: "white",
                    activeBackgroundColor: "white",
                    height: 25,
                    width: 25,
                  }}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                height: 50,
                width: "95%",
                alignContent: "center",
              }}
            >
              <View style={{ flex: 4, justifyContent: "center" }}>
                <Text style={styles.label}>Letzten Eintrag teilen</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Toggle
                  value={config.shareLastEntry}
                  onPress={() => {
                    setConfig({
                      ...config,
                      shareLastEntry: !config.shareLastEntry,
                    });
                    setSaved(false);
                  }}
                  trackBar={{
                    activeBackgroundColor: "#0080FF",
                    inActiveBackgroundColor: "#131520",
                    width: 50,
                    height: 25,
                  }}
                  thumbButton={{
                    inActiveBackgroundColor: "white",
                    activeBackgroundColor: "white",
                    height: 25,
                    width: 25,
                  }}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                height: 50,
                width: "95%",
                alignContent: "center",
              }}
            >
              <View style={{ flex: 4, justifyContent: "center" }}>
                <Text style={styles.label}>GPS-Daten erfassen</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Toggle
                  value={config.saveGPS}
                  onPress={() => {
                    setConfig({ ...config, saveGPS: !config.saveGPS });
                    setSaved(false);
                  }}
                  trackBar={{
                    activeBackgroundColor: "#0080FF",
                    inActiveBackgroundColor: "#131520",
                    width: 50,
                    height: 25,
                  }}
                  thumbButton={{
                    inActiveBackgroundColor: "white",
                    activeBackgroundColor: "white",
                    height: 25,
                    width: 25,
                  }}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                height: 50,
                width: "95%",
                alignContent: "center",
              }}
            >
              <View style={{ flex: 4, justifyContent: "center" }}>
                <Text style={styles.label}>GPS-Daten teilen</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Toggle
                  disabled={!config.saveGPS}
                  value={config.shareGPS}
                  onPress={() => {
                    setConfig({
                      ...config,
                      shareGPS: !config.shareGPS,
                    });
                    setSaved(false);
                  }}
                  trackBar={{
                    activeBackgroundColor: "#0080FF",
                    inActiveBackgroundColor: "#131520",
                    width: 50,
                    height: 25,
                  }}
                  thumbButton={{
                    inActiveBackgroundColor: "white",
                    activeBackgroundColor: "white",
                    height: 25,
                    width: 25,
                  }}
                />
              </View>
            </View>

            <View style={{ height: 30 }}></View>

            <View
              style={{
                flexDirection: "row",
                height: 50,
                width: "95%",
                alignContent: "center",
              }}
            >
              <View style={{ flex: 4, justifyContent: "center" }}>
                <Text style={styles.label}>Helles Design</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Toggle
                  value={lightmode}
                  onPress={(val) => setLightMode(val)}
                  trackBar={{
                    activeBackgroundColor: "#0080FF",
                    inActiveBackgroundColor: "#131520",
                    width: 50,
                    height: 25,
                  }}
                  thumbButton={{
                    inActiveBackgroundColor: "white",
                    activeBackgroundColor: "white",
                    height: 25,
                    width: 25,
                  }}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                height: 50,
                width: "95%",
                alignContent: "center",
              }}
            >
              <View style={{ flex: 4, justifyContent: "center" }}>
                <Text style={styles.label}>Tutorial anzeigen</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Toggle
                  value={config.showTutorial}
                  onPress={() => {
                    setConfig({
                      ...config,
                      showTutorial: !config.showTutorial,
                    });
                    setSaved(false);
                  }}
                  trackBar={{
                    activeBackgroundColor: "#0080FF",
                    inActiveBackgroundColor: "#131520",
                    width: 50,
                    height: 25,
                  }}
                  thumbButton={{
                    inActiveBackgroundColor: "white",
                    activeBackgroundColor: "white",
                    height: 25,
                    width: 25,
                  }}
                />
              </View>
            </View>

            <View style={{ height: 30 }}></View>
            {saved ? (
              <Button
                fontColor={"rgba(255,255,255,0.5)"}
                onPress={() => {}}
                borderradius={100}
                color={"#131520"}
                title={"Gespeichert"}
              />
            ) : (
              <Button
                fontColor={"white"}
                onPress={() => {
                  storeSettings();
                }}
                borderradius={100}
                color={"#0080FF"}
                title={"Speichern"}
              />
              
            )}

          <View style={{ height: 30 }}></View>
          </ScrollView>
        )}
      </Animated.View>
    </>
  );
};

export default Config;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1E2132",
    justifyContent: "center",
  },
  heading: {
    color: "white",
    fontSize: responsiveFontSize(2.3),
    fontFamily: "PoppinsBlack",
    marginLeft: 20,
  },
  label: {
    color: "rgba(255,255,255,0.75)",
    fontSize: responsiveFontSize(1.6),
    fontFamily: "PoppinsLight",
    marginLeft: 20,
  },
  text: {
    alignSelf: "center",
    fontFamily: "PoppinsLight",
    fontSize: 18,
    color: "white",
    maxWidth: 250,
    textAlign: "center",
  },
});
