import React, { useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
import OutputComponent from "../components/OutputComponent";
import PersonListComponent from "../components/person-list/PersonListComponent";
import TotalBillComponent from "../components/TotalBillComponent";
import { Context as BillContext } from "../context/BillContext";
import { Context as HistoryContext } from "../context/HistoryContext";

const BillSplitter = () => {
    const [contributionEditsAreInProgress, setEditsInProgress] = useState(true);
    const { state } = useContext(BillContext);
    const { state: { store }} = useContext(HistoryContext);

    return (
        <View style={styles.container}>
            <TotalBillComponent />
            <PersonListComponent setEditsInProgress={setEditsInProgress} />
            <OutputComponent title="Totals" shouldDisplay={!contributionEditsAreInProgress} onSave={() => {
                store.saveState(state);
            }} data={state} style={{ maxHeight: '50%' }} />
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