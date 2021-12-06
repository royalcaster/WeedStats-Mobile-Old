import React from "react";
import JointCounter from './JointCounter';
import BongCounter from './BongCounter';
import VapeCounter from './VapeCounter';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { StyleSheet, Text, TouchableWithoutFeedbackBase, View, Image, ScrollView, Pressable } from 'react-native';

const Stats = ({ user, statConfig }) => {
    return (
        <ScrollView style={styles.counters_container}>

            <View style={styles.header_container}>
              <Text style={styles.main_heading}>WeedStats</Text>
            </View>

            <View style={{height: 15}}></View>
            
            {
              !statConfig.joint && !statConfig.bong && !statConfig.vape ? 
                <View style={{justifyContent: "center"}}>
                    <FontAwesome style={{color: "rgba(255,255,255,0.3)", fontSize: 80, marginTop: 40, alignSelf: "center"}} name="close" />
                    <Text style={styles.blank_text}>Keine Stats aktiviert!</Text>
                    <Text style={styles.blank_text}>Konfiguriere deine Ansicht in den <FontAwesome style={{fontSize: 20}} name="sliders" /> Einstellungen.</Text>
                </View> : <>
              {
              statConfig.joint ? <JointCounter counter={user.joint_counter} level_status={calcLevelStatus(user.joint_counter)} level={calcLevelName(user.joint_counter)} level_index={Math.ceil(user.joint_counter / 70)} bg_color={calcLevelColor(user.joint_counter)}></JointCounter> : null
            }
            {
              statConfig.bong ? <BongCounter counter={user.bong_counter} level_status={calcLevelStatus(user.bong_counter)} level={calcLevelName(user.bong_counter)} level_index={Math.ceil(user.bong_counter / 70)} bg_color={calcLevelColor(user.bong_counter)}></BongCounter> : null
            }
            {
              statConfig.vape ? <VapeCounter counter={user.vape_counter} level_status={calcLevelStatus(user.vape_counter)} level={calcLevelName(user.vape_counter)} level_index={Math.ceil(user.vape_counter / 70)} bg_color={calcLevelColor(user.vape_counter)}></VapeCounter> : null
            }</>
            }
            
        </ScrollView>
    );
}

export default Stats

const calcLevelColor = (counter) => {
    if (counter == 420) {
      return "#D90F0F";
    }
    else {
    var indicator = Math.ceil(counter / 70);
    switch(indicator) {
      case 0: return "#3BA426"; break;
      case 1: return "#3BA426"; break;
      case 2: return "#81440A"; break;
      case 3: return "#c85a14"; break;
      case 4: return "#0781E1"; break;
      case 5: return "#4A26A4"; break;
      case 6: return "#C407E1"; break;
      case 7: return "#D90F0F"; break;
      default: return "#D90F0F"; break;
    }
  }
  }

  const calcLevelName = (counter) => {
    if (counter == 420) {
      return "Legende";
    }
    else {
    var indicator = Math.ceil(counter / 70);
    switch(indicator) {
      case 0: return "Nappo"; break;
      case 1: return "Nappo"; break;
      case 2: return "Beginner"; break;
      case 3: return "Amateur"; break;
      case 4: return "Fortgeschrittener"; break;
      case 5: return "Smurf"; break;
      case 6: return "Experte"; break;
      case 7: return "Legende"; break;
      default: return "Legende"; break;
    }
  }
  }

  
const calcLevelStatus = (counter) => {
    if (counter == 420) {
      return "100%";
    }
    else {
    var indicator = Math.ceil(counter / 70);
    switch(indicator) {
      case 0: return "0%"; break;
      case 1: return 100*counter/70 + "%"; break;
      case 2: return 100*(counter - 70)/70 + "%"; break;
      case 3: return 100*(counter - 140)/70 + "%"; break;
      case 4: return 100*(counter - 210)/70 + "%"; break;
      case 5: return 100*(counter - 280)/70 + "%"; break;
      case 6: return 100*(counter - 350)/70 + "%"; break;
      case 7: return "100%"; break;
      default: return "100%"; break;
    }
  }
  }

const styles = StyleSheet.create({
    counters_container: {
        flex: 5,
        backgroundColor: "#1E1E1E",
        width: "100%",
        height: 200
    },
    blank_text: {
      color: "#787878",
      fontSize: 15,
      alignSelf: "center",
      fontFamily: "PoppinsLight",
      marginTop: 15
    },
    header_container: {
        flexDirection: "row",
        width: "100%",
        marginBottom: 20,
        position: "relative",
        top: 20,
        justifyContent: "center"
    },
    main_heading: {
        color: "white",
        fontSize: 30,
        fontFamily: "PoppinsBlack",
        marginTop: 20,
        position: "relative"
    },
});