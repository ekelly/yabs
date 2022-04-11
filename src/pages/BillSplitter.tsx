import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import OutputComponent from "../components/OutputComponent";
import PersonListComponent from "../components/person-list/PersonListComponent";
import TotalBillComponent from "../components/TotalBillComponent";

const BillSplitter = () => {
    const [contributionEditsAreInProgress, setEditsInProgress] = useState(true);

    return (
        <View style={styles.container}>
            <TotalBillComponent />
            <PersonListComponent setEditsInProgress={setEditsInProgress} />
            <OutputComponent shouldDisplay={!contributionEditsAreInProgress} />
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