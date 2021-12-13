import React, { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import { StyleSheet, View } from "react-native";
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

const HistoryTable = (user) => {
  const data = [
    ["-", "-", "-", "-"],
    ["-", "-", "-", "-"],
    ["-", "-", "-", "-"],
    ["-", "-", "-", "-"],
    ["-", "-", "-", "-"],
    ["-", "-", "-", "-"],
    ["-", "-", "-", "-"],
    ["-", "-", "-", "-"],
    ["-", "-", "-", "-"],
    ["-", "-", "-", "-"],
  ];
  const headData = ["Nr", "Typ", "Uhrzeit", "Löschen"];

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
