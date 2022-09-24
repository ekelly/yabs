import { useNavigation, CommonActions } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import OutputComponent from "../components/OutputComponent";
import PersonListComponent from "../components/person-list/PersonListComponent";
import TotalBillComponent from "../components/TotalBillComponent";
import { Context as BillContext } from "../context/BillContext";
import { Context as HistoryContext } from "../context/HistoryContext";

const BillSplitter = () => {
    const [contributionEditsAreInProgress, setEditsInProgress] = useState(true);
    const [firstPersonNameRef, setFirstPersonNameRef] = useState<TextInput|null>(null);
    const { state } = useContext(BillContext);
    const { state: { store }} = useContext(HistoryContext);
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TotalBillComponent firstNameInput={firstPersonNameRef} />
            <PersonListComponent setEditsInProgress={setEditsInProgress} setFirstPersonNameRef={setFirstPersonNameRef} />
            <OutputComponent title="Totals" shouldDisplay={!contributionEditsAreInProgress} onSave={() => {
                store.saveState(state);
                navigation.dispatch(CommonActions.navigate({
                    name: "Saved"
                }));
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