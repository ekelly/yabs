import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState, useEffect, useCallback, useRef } from "react";
import { View, StyleSheet, TextInput, AppState } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import OutputComponent from "../components/OutputComponent";
import PersonListComponent from "../components/person-list/PersonListComponent";
import SwipeComponent from "../components/SwipeComponent";
import TotalBillComponent from "../components/TotalBillComponent";
import { Context as BillContext } from "../context/BillContext";
import { Context as HistoryContext } from "../context/HistoryContext";

const BillSplitter = () => {
    const [contributionEditsAreInProgress, setEditsInProgress] = useState(true);
    const [firstPersonNameRef, setFirstPersonNameRef] = useState<TextInput|null>(null);
    const outputSwipeableRef = useRef<Swipeable>(null);
    const { state, actions: { clearAll } } = useContext(BillContext);
    const { state: { store }} = useContext(HistoryContext);
    const navigation = useNavigation();
    const saveState = useCallback(() => {
        console.log("Id: " + state.id + " total: " + state.total);
        store.saveState(state);
      }, [state]);

    // Save to the history view automatically whenever the app moves to the background
    useEffect(() => {
        navigation.addListener('blur', saveState);
        const subscription = AppState.addEventListener("change", nextAppState => {
            if (nextAppState.match(/inactive|background/)) {
                saveState();
            }
        });
        return () => {
          subscription.remove();
        };
      }, [saveState]);

    const saveAndClear = useCallback(() => {
        saveState();
        clearAll();
        outputSwipeableRef.current?.close();
        setEditsInProgress(false);
    }, [outputSwipeableRef, setEditsInProgress]);

    return (
        <View style={styles.container}>
            <TotalBillComponent firstNameInput={firstPersonNameRef} />
            <PersonListComponent 
                setEditsInProgress={setEditsInProgress} 
                setFirstPersonNameRef={setFirstPersonNameRef} />
            <SwipeComponent 
                    text="Save" 
                    color="#00f600" 
                    onSwipe={saveAndClear} 
                    swipeDirection="right" 
                    style={{ maxHeight: '50%' }} 
                    setRef={outputSwipeableRef}>
                <OutputComponent title="Totals" shouldDisplay={!contributionEditsAreInProgress} data={state} />
            </SwipeComponent>
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