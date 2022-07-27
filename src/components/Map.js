import React, { useEffect, useReducer, useState, useRef } from "react";
import { useFonts } from "expo-font";
import {
  StyleSheet,
  Image,
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TouchableNativeFeedback,
} from "react-native";

import IconButton from "./IconButton";

import AntDesign from "react-native-vector-icons/AntDesign";

import Empty from "./Empty";

import uuid from "react-native-uuid";

import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Heatmap,
} from "react-native-maps";

import AsyncStorage from "@react-native-async-storage/async-storage";

import ProfileImage from "./ProfileImage";

import { Pages } from "react-native-pages";

import CustomMarker from "./CustomMarker";

import { LinearGradient } from "expo-linear-gradient";

import { LogBox } from "react-native";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { firestore } from "./FirebaseConfig";

const Map = ({ user }) => {
  LogBox.ignoreAllLogs();

  const windowHeight = Dimensions.get("window").height;

  const [view, setView] = useState("friends");

  const [localData, setLocalData] = useState([]);

  const [localDataLoaded, setLocalDataLoaded] = useState(false);

  const carouselRef = React.useRef(null);

  const [mapType, setMapType] = useState("standard");

  const [region, setRegion] = useState(null);

  const [loading, setLoading] = useState(true);

  const [markers, setMarkers] = useState([]);

  const camref = useRef(null);

  const Camera1 = {
  headering: "",
   pitch: 0,
  }

  const Camera2 = {
    headering: "",
    pitch: 100,
   }

  /* const initRegion = {
    latitude: 50.612610476359684,
    longitude: 12.626925924754111,
    latitudeDelta: 0.25,
    longitudeDelta: 0.25,
  }; */

  useEffect(() => {
    loadData(); //Freunde + deren letzte Einträge
    getLocalData(); //Einträge des Users für Heatmap
  }, []);

  /* useEffect(() => {
    console.log(markers.length);
  },[markers]); */

  const loadData = async () => {
    try {
      const docRef = doc(firestore, "users", user.id);
      const docSnap = await getDoc(docRef);

      var friends;
      if (docSnap.exists()) {
        friends = docSnap.data().friends;
      }

      var buffer = [];
      friends.forEach(async (friend) => {
        const docRef = doc(firestore, "users", friend);
        const friendSnap = await getDoc(docRef);

        if (
          docSnap.exists() &&
          friendSnap.data().last_entry_latitude != null &&
          friendSnap.data().last_entry_longitude != null
        ) {
          buffer.push({
            latitude: friendSnap.data().last_entry_latitude,
            longitude: friendSnap.data().last_entry_longitude,
            timestamp: friendSnap.data().last_entry_timestamp,
            type: friendSnap.data().last_entry_type,
            photoUrl: friendSnap.data().photoUrl,
            username: friendSnap.data().username,
          });
          buffer.length == 1 ? setRegion({
            latitude: friendSnap.data().last_entry_latitude,
            longitude: friendSnap.data().last_entry_longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }) : null;
        }
      });
      setMarkers(buffer);
      setLoading(false);
    } catch (e) {
      console.log("Load Data Error:", e);
    }
  };

  const toggleMapType = () => {
    mapType == "standard" ? setMapType("hybrid") : setMapType("standard");
  }

  const chopTimeStamp = (timestamp) => {
    var a = new Date(timestamp);
    return [a.toDateString(), a.toTimeString().substring(0, 5) + " Uhr"];
  };

  const getRelevantKeys = async () => {
    let keys = [];
    try {
      keys = await AsyncStorage.getAllKeys();
    } catch (e) {
      console.log("Error:", e);
    }

    return keys.filter((key) => key.includes(user.id + "_entry_"));
  };

  const switch_icon = <AntDesign name={"picture"} style={{fontSize: 20, color: "white"}}/>

  const getLocalData = async () => {
    try {
      const jsonData = await AsyncStorage.multiGet(await getRelevantKeys());
      jsonData.forEach((entry) => localData.push(JSON.parse(entry[1])));
      /* localData.sort((a, b) => {
          return a.number - b.number;
        }); */
      setLocalDataLoaded(true);
    } catch (e) {
      console.log("Error:", e);
    }
  };

  const filterNull = (array) => {
    return array.filter((entry) => {
      return entry.latitude != null && entry.longitude != null;
    });
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity
        style={styles.item}
        /* onPress={() => {
                       carouselRef.current.scrollToIndex(index);
                        console.log("test");
                      }} */
      >
        <View
          style={{ flexDirection: "row", height: "100%", alignItems: "center" }}
        >
          <View style={{ flex: 1 }}>
            <ProfileImage url={item.photoUrl} x={80} type={2} />
          </View>

          <View
            style={{
              flex: 2,
              flexDirection: "column",
              paddingLeft: 15,
              height: "80%",
            }}
          >
            <View style={{ flex: 2 }}>
              <Text
                style={{
                  color: "white",
                  fontFamily: "PoppinsBlack",
                  height: "100%",
                  textAlignVertical: "center",
                  fontSize: 17,
                }}
              >
                {item.username}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "rgba(255,255,255,0.75)",
                  fontFamily: "PoppinsLight",
                  height: "100%",
                  textAlignVertical: "center",
                  fontSize: 13,
                }}
              >
                {chopTimeStamp(item.timestamp)[0]}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "rgba(255,255,255,0.75)",
                  fontFamily: "PoppinsLight",
                  height: "100%",
                  textAlignVertical: "center",
                  fontSize: 13,
                }}
              >
                {chopTimeStamp(item.timestamp)[1]}
              </Text>
            </View>
          </View>

          <View style={{ flex: 1 }}>
            {item.type == "joint" ? (
              <Image
                style={{
                  position: "relative",
                  left: 0,
                  height: 65,
                  width: 20,
                  alignSelf: "center",
                }}
                source={require("./img/joint.png")}
              />
            ) : null}
            {item.type == "bong" ? (
              <Image
                style={{
                  position: "relative",
                  left: 0,
                  height: 65,
                  width: 40,
                  alignSelf: "center",
                }}
                source={require("./img/bong.png")}
              />
            ) : null}
            {item.type == "vape" ? (
              <Image
                style={{
                  position: "relative",
                  left: 0,
                  height: 65,
                  width: 40,
                  alignSelf: "center",
                }}
                source={require("./img/vape.png")}
              />
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} scrollEnabled={false}>
      <View style={{ height: 20 }}></View>

      <View style={{ alignItems: "center" }}>
        <LinearGradient
          colors={mapType != "standard" ? ["#1E2132", "rgba(0,0,0,0)"] : ["rgba(0,0,0,0.85)", "rgba(0,0,0,0)"]}
          style={{
            width: "100%",
            alignSelf: "center",
            alignItems: "center",
            zIndex: 3,
            position: "absolute",
            height: 150,
            marginTop: -20,
          }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              marginTop: 40,
              height: 50,
            }}
          >
            <View style={{ flex: 1 }}>
              <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple(
                  "rgba(255,255,255,0.15)",
                  false
                )}
                onPress={() => setView("heatmap")}
              >
                <View style={styles.touchable}>
                  <Text
                    style={[
                      styles.button,
                      { color: view == "heatmap" ? "#0080FF" : "white" },
                    ]}
                  >
                    H E A T M A P
                  </Text>
                </View>
              </TouchableNativeFeedback>
            </View>

            <View style={{ flex: 1 }}>
              <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple(
                  "rgba(255,255,255,0.15)",
                  false
                )}
                onPress={() => setView("friends")}
              >
                <View style={styles.touchable}>
                  <Text
                    style={[
                      styles.button,
                      { color: view == "friends" ? "#0080FF" : "white" },
                    ]}
                  >
                    F R E U N D E
                  </Text>
                </View>
              </TouchableNativeFeedback>
            </View>

            {/* style={[styles.button,{color: view == "friends" ? "white" : "#0080FF"}]} */}
          </View>
        </LinearGradient>

        {!loading && localDataLoaded ? (
          <>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={[{ height: windowHeight }, styles.map]}
            customMapStyle={mapStyle}
            showsUserLocation={true}
            mapType={mapType}
            followsUserLocation={true}
            region={region}
            onRegionChangeComplete={(region) => setRegion(region)}
            showsCompass={false}
            showsTraffic={false}
            showsIndoors={false}
            pitchEnabled={true}
            showsMyLocationButton={false}
            camera={Camera1}
            ref={camref}
            onMapReady={() => camref.current.animateCamera(Camera2)}
            loadingBackgroundColor={"#131520"}
          >
            {view == "heatmap" ? 
            <>
            {localData.length == 0 ? null : 
            <Heatmap
                points={filterNull(localData).map((entry) => {
                  return {
                    latitude: entry.latitude,
                    longitude: entry.longitude,
                  };
                })}
                radius={40}
              /> } 
              </>: null}

            {view == "friends" ? (
              <>
                {markers.map((marker, index) => (
                  <Marker
                    tracksViewChanges={false}
                    key={uuid.v4()}
                    coordinate={{
                      latitude: marker.latitude,
                      longitude: marker.longitude,
                    }}
                    onPress={() => carouselRef.current.scrollToPage(index)}
                  >
                    <CustomMarker
                      photoUrl={marker.photoUrl}
                      username={"test"}
                      type={marker.type}
                      timestamp={marker.timestamp}
                    />
                  </Marker>
                ))}
              </>
            ) : null}
          </MapView>
          <View style={{alignSelf: "center", bottom: 200, right: 20, position: "absolute"}}>
            <IconButton icon={switch_icon} onPress={toggleMapType}/>
          </View>
          </>
        ) : null}

        {view == "friends" ? (
          <View style={styles.carousel}>
            <Pages
              onScrollEnd={(index) => {
                setRegion({
                  latitude: markers[index].latitude,
                  longitude: markers[index].longitude,
                  longitudeDelta: region.longitudeDelta,
                  latitudeDelta: region.latitudeDelta,
                });
              }}
              ref={carouselRef}
            >
              {markers.map((marker) => {
                return <View key={uuid.v4()}>{renderItem(marker)}</View>;
              })}
            </Pages>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E2132",
    width: "100%",
    height: "50%",
  },
  map: {
    width: "100%",
    position: "relative",
    top: -20,
    backgroundColor: "#171717",
  },
  item: {
    height: 80,
    width: "95%",
    alignSelf: "center",
    backgroundColor: "#1E2132",
    position: "absolute",
    zIndex: 2,
    borderRadius: 10,
    overflow: "hidden",
    margin: 10,
  },
  carousel: {
    height: 112,
    width: "100%",
    position: "absolute",
    zIndex: 2,
    bottom: 55,
    marginBottom: 20,
  },
  touchable: {
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  button: {
    fontFamily: "PoppinsLight",
    fontSize: 18,
    height: "100%",
    textAlignVertical: "center",
  },
});

const mapStyle = [
  {
    elementType: "labels",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#131520",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#746855",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#242f3e",
      },
    ],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#263c3f",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#6b9a76",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#38414e",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#212a37",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9ca5b3",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#746855",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#1f2835",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#f3d19c",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [
      {
        color: "#2f3948",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#17263c",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#515c6d",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#17263c",
      },
    ],
  },
];
