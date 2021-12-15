import React, { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import { SnapshotViewIOSBase, StyleSheet, View } from "react-native";

import {
  ref,
  onChildAdded,
  get,
  child,
  query,
  limitToLast,
} from "firebase/database";
import { db } from "./FirebaseConfig";
import { Timestamp } from "firebase/firestore";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from "react-native-table-component";

let data = Array.from(Array(10), () => new Array(5));

const HistoryTable = ({ user }) => {
  const [loaded] = useFonts({
    PoppinsBlack: require("./fonts/Poppins-Black.ttf"),
    PoppinsLight: require("./fonts/Poppins-Light.ttf"),
  });

  const dbUserRef = query(ref(db, "users/" + user.username), limitToLast(10));

  get(dbUserRef, (snapshot) => {
    if (snapshot.exists()) {
      data.unshift([
        snapshot.val().number,
        snapshot.val().type,
        new Date(snapshot.val().timestamp).toLocaleDateString("de-DE"),
        new Date(snapshot.val().timestamp).toLocaleTimeString("de-DE"),
        "[X]",
      ]);
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error("Error bei HistoryTable");
  });

  onChildAdded(dbUserRef, (snapshot) => {
    data.unshift([
      snapshot.val().number,
      snapshot.val().type,
      new Date(snapshot.val().timestamp).toLocaleDateString("de-DE"),
      new Date(snapshot.val().timestamp).toLocaleTimeString("de-DE"),
      "[X]",
    ]);
    data.pop();
  });

  const headData = ["Nr.", "Typ", "Datum", "Uhrzeit", "[X]"];

  return (
    <>
      <Table borderStyle={{ borderWidth: 1, borderColor: "#0080FF" }}>
        <Row
          data={headData}
          style={styles.HeadStyle}
          textStyle={styles.TableText}
          flexArr={[1, 2, 2, 2, 1]}
        />
        <Rows
          data={data}
          textStyle={styles.TableText}
          flexArr={[1, 2, 2, 2, 1]}
        />
      </Table>
    </>
  );
};

export default HistoryTable;

const styles = StyleSheet.create({
  HeadStyle: {
    height: 50,
    alignContent: "center",
    backgroundColor: "#2b2b2b",
  },
  TableText: {
    margin: 10,
    color: "white",
    fontFamily: "PoppinsLight",
  },
});
