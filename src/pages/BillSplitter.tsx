import { useNavigation, CommonActions } from "@react-navigation/native";
import React, { useContext, useState, useEffect, useCallback } from "react";
import { View, StyleSheet, TextInput, AppState } from "react-native";
import OutputComponent from "../components/OutputComponent";
import PersonListComponent from "../components/person-list/PersonListComponent";
import TotalBillComponent from "../components/TotalBillComponent";
import { BillState, Context as BillContext } from "../context/BillContext";
import { Context as HistoryContext } from "../context/HistoryContext";

const BillSplitter = () => {
    const [contributionEditsAreInProgress, setEditsInProgress] = useState(true);
    const [firstPersonNameRef, setFirstPersonNameRef] = useState<TextInput|null>(null);
    const { state } = useContext(BillContext);
    const { state: { store }} = useContext(HistoryContext);
    const navigation = useNavigation();
    const saveState = useCallback(() => {
        console.log("Id: " + state.id + " total: " + state.total);
        store.saveState(state);
      }, [state]);

    // Save to the history view automatically whenever the app moves to the background
    useEffect(() => {
        const subscription = AppState.addEventListener("change", nextAppState => {
            if (nextAppState.match(/inactive|background/)) {
                saveState();
            }
        });
        return () => {
          subscription.remove();
        };
      }, [saveState]);

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