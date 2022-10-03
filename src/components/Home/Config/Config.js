//React
import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Dimensions,
  View,
  LogBox,
  StyleSheet,
  Text,
  Animated,
  ScrollView,
  Modal,
  Vibration
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
import LanguageSelector from "./LanguageSelector/LanguageSelector";

//Service
import { LanguageContext } from "../../../data/LanguageContext";

const Config = ({ toggleLanguage }) => {

  const language = useContext(LanguageContext);

  const [config, setConfig] = useState();
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(true);
  const [lightmode, setLightMode] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    loadSettings();
    LogBox.ignoreAllLogs();
  }, []);

  const vibrate = (ms) => {
    Vibration.vibrate(ms);
  }

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
      toggleLanguage(config.language);
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

  const handleLanguageSwitch = (lang) => {
    setConfig({...config, language: lang});
  }

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
                  {language.config_modal_title}
                </Text>
              </View>
              <View style={{ flex: 2 }}>
                <Text style={[styles.text, { fontSize: responsiveFontSize(1.8) }]}>
                  {language.config_modal_text}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  title={language.config_modal_thanks}
                  color={"#0080FF"}
                  borderradius={25}
                  fontColor={"white"}
                  onPress={() => setLightMode(false)}
                  hovercolor={"rgba(255,255,255,0.3)"}
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
            <CustomLoader x={50} color={"#0080FF"}/>
          </View>
        ) : (
          <View style={{height: "90%", top: 50, position: "absolute", width: "100%"}}>
          <ScrollView style={{ width: "100%"}}>
            <Text style={styles.heading}>{language.config_counter}</Text>

            <View style={{ flexDirection: "row", width: "100%" }}>
              <ConfigItem
                type="joint"
                config={config.showJoint}
                onToggle={() => {
                  setConfig({ ...config, showJoint: !config.showJoint });
                  vibrate(25);
                  setSaved(false);
                }}
              ></ConfigItem>
              <ConfigItem
                type="bong"
                config={config.showBong}
                onToggle={() => {
                  setConfig({ ...config, showBong: !config.showBong });
                  vibrate(25);
                  setSaved(false);
                }}
              ></ConfigItem>
              <ConfigItem
                type="vape"
                config={config.showVape}
                onToggle={() => {
                  setConfig({ ...config, showVape: !config.showVape });
                  vibrate(25);
                  setSaved(false);
                }}
              ></ConfigItem>
              <ConfigItem
                type="pipe"
                config={config.showPipe}
                onToggle={() => {
                  setConfig({ ...config, showPipe: !config.showPipe });
                  vibrate(25);
                  setSaved(false);
                }}
              ></ConfigItem>
              <ConfigItem
                type="cookie"
                config={config.showCookie}
                onToggle={() => {
                  setConfig({ ...config, showCookie: !config.showCookie });
                  vibrate(25);
                  setSaved(false);
                }}
              ></ConfigItem>
            </View>

            <Text style={styles.heading}>{language.config_personal_data}</Text>
            <View style={{ height: 5 }}></View>

            <View
              style={styles.toggle_container}
            >
              <View style={{ flex: 4, justifyContent: "center" }}>
                <Text style={styles.label}>{language.config_share_main_counter}</Text>
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
                    vibrate(25);
                    setSaved(false);
                  }}
                  trackBar={{
                    activeBackgroundColor: "#484F78",
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
              style={styles.toggle_container}
            >
              <View style={{ flex: 4, justifyContent: "center" }}>
                <Text style={styles.label}>{language.config_share_detail_counter}</Text>
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
                    vibrate(25);
                    setSaved(false);
                  }}
                  trackBar={{
                    activeBackgroundColor: "#484F78",
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
              style={styles.toggle_container}
            >
              <View style={{ flex: 4, justifyContent: "center" }}>
                <Text style={styles.label}>{language.config_share_last_activity}</Text>
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
                    vibrate(25);
                    setSaved(false);
                  }}
                  trackBar={{
                    activeBackgroundColor: "#484F78",
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
              style={styles.toggle_container}
            >
              <View style={{ flex: 4, justifyContent: "center" }}>
                <Text style={styles.label}>{language.config_get_location}</Text>
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
                    vibrate(25);
                    setSaved(false);
                  }}
                  trackBar={{
                    activeBackgroundColor: "#484F78",
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
              style={styles.toggle_container}
            >
              <View style={{ flex: 4, justifyContent: "center" }}>
                <Text style={styles.label}>{language.config_share_location}</Text>
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
                    vibrate(25);
                    setSaved(false);
                  }}
                  trackBar={{
                    activeBackgroundColor: "#484F78",
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

            <Text style={styles.heading}>{language.config_security}</Text>
            <View style={{ height: 5 }}></View>

            <View
              style={styles.toggle_container}
            >
              <View style={{ flex: 4, justifyContent: "center" }}>
                <Text style={styles.label}>{language.config_unlock_on_launch}</Text>
              </View>
            <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Toggle
                  value={config.localAuthenticationRequired}
                  onPress={() => {
                    setConfig({
                      ...config,
                      localAuthenticationRequired: !config.localAuthenticationRequired,
                    });
                    vibrate(25);
                    setSaved(false);
                  }}
                  trackBar={{
                    activeBackgroundColor: "#484F78",
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

            <Text style={styles.heading}>{language.config_language}</Text>
            <View style={{ height: 5 }}></View>

            <LanguageSelector toggleLanguage={(lang) => {handleLanguageSwitch(lang); setSaved(false)}} value={config.language} onVibrate={() => vibrate(25)}/>

            <View style={{ height: 30 }}></View>

            <Text style={styles.heading}>{language.config_other}</Text>
            <View style={{ height: 5 }}></View>

            <View
              style={styles.toggle_container}
            >
              <View style={{ flex: 4, justifyContent: "center" }}>
                <Text style={styles.label}>{language.config_lightmode}</Text>
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
                  onPress={(val) => {setLightMode(val); vibrate(25);}}
                  trackBar={{
                    activeBackgroundColor: "#484F78",
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

          <View style={{ height: responsiveHeight(10) }}></View>
          </ScrollView>
          </View>
        )}

          <View style={styles.save_button_container}>
            {saved ? (
              <Button
                fontColor={"rgba(255,255,255,0.5)"}
                onPress={() => {}}
                borderradius={100}
                color={"#131520"}
                title={language.config_saved}
                hovercolor={"rgba(255,255,255,0.3)"}
              />
            ) : (
              <Button
                fontColor={"white"}
                onPress={() => {
                  vibrate(100);
                  storeSettings();
                }}
                borderradius={100}
                color={"#0080FF"}
                title={language.config_save}
                hovercolor={"rgba(255,255,255,0.3)"}
              />
              
            )}
            </View>
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
    fontFamily: "PoppinsMedium",
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
  save_button_container: {
    width: "100%",
    position: "absolute",
    bottom: 0
  },
  toggle_container: {
    flexDirection: "row",
    height: 40,
    width: "95%",
    alignContent: "center",
  }
});
