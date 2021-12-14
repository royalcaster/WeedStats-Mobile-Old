import React, { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import { SnapshotViewIOSBase, StyleSheet, View } from "react-native";

import { ref, onValue, query, limitToLast } from "firebase/database";
import { db } from "./FirebaseConfig";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from "react-native-table-component";

let data = [
  ["-", "-", "-", "[X]"],
  ["-", "-", "-", "[X]"],
  ["-", "-", "-", "[X]"],
  ["-", "-", "-", "[X]"],
  ["-", "-", "-", "[X]"],
  ["-", "-", "-", "[X]"],
  ["-", "-", "-", "[X]"],
  ["-", "-", "-", "[X]"],
  ["-", "-", "-", "[X]"],
  ["-", "-", "-", "[X]"],
];

const HistoryTable = ({ user }) => {
  const dbUserRef = query(ref(db, "users/" + user.username), limitToLast(10));

  let i = 9;

  onValue(dbUserRef, (snapshot) => {
    snapshot.forEach((daten) => {
      data[i][0] = daten.val().number;
      data[i][1] = daten.val().type;
      data[i][2] = daten.val().timestamp;
      i > 0 ? i-- : (i = 9);
    });
  });

  const headData = ["Nr.", "Typ", "Uhrzeit", "Löschen"];

  return (
    <>
      <Table borderStyle={{ borderWidth: 1, borderColor: "#0080FF" }}>
        <Row
          data={headData}
          style={styles.HeadStyle}
          textStyle={styles.TableText}
        />
        <Rows data={data} textStyle={styles.TableText} />
      </Table>
    </>
  );
};

export default HistoryTable;

const styles = StyleSheet.create({
  HeadStyle: {
    height: 50,
    alignContent: "center",
  },
  TableText: {
    margin: 10,
    color: "white",
  },
});
