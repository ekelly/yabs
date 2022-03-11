import React from "react";
import { View, StyleSheet } from "react-native";
import OutputComponent from "../components/OutputComponent";
import PersonListComponent from "../components/person-list/PersonListComponent";
import TotalBillComponent from "../components/TotalBillComponent";

const BillSplitter = () => {
    

    return (
        <View style={styles.container}>
            <TotalBillComponent />
            <PersonListComponent />
            <OutputComponent />
        </View>
    );
}
  
const styles = StyleSheet.create({
    container: {
        margin: 10,
        flex: 1
    }
});

export default BillSplitter;