import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState, useEffect, useCallback, useRef } from "react";
import { View, StyleSheet, TextInput, AppState } from "react-native";
import OutputComponent from "../components/OutputComponent";
import PersonListComponent from "../components/person-list/PersonListComponent";
import TotalBillComponent from "../components/TotalBillComponent";
import { Context as BillContext } from "../context/BillContext";
import { Context as HistoryContext } from "../context/HistoryContext";
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import SwipeComponent from "../components/SwipeComponent";
import { Swipeable } from "react-native-gesture-handler";

const BillSplitter = () => {
    const [firstPersonNameRef, setFirstPersonNameRef] = useState<TextInput|null>(null);
    const { state, actions: { clearAll } } = useContext(BillContext);
    const { state: { store }} = useContext(HistoryContext);
    const swipeableRef = useRef<Swipeable|null>(null);
    const navigation = useNavigation();
    const saveState = useCallback(() => {
        console.log("Saving BillState state");
        store.saveState(state);
      }, [state]);

    // Save to the history view automatically whenever the app moves to the background
    useEffect(() => {
        const unsubscribeBlur = navigation.addListener('blur', () => {
            saveState()
        });
        const appStateSubscription = AppState.addEventListener("change", nextAppState => {
            if (nextAppState.match(/inactive|background/)) {
                saveState();
            }
        });
        return () => {
            unsubscribeBlur();
            appStateSubscription.remove();
        };
      }, [saveState, store]);

    const saveAndClear = useCallback(() => {
        saveState();
        clearAll();
        swipeableRef?.current?.close();
    }, [saveState]);

    return (
        <View style={styles.container}>
            <TotalBillComponent firstNameInput={firstPersonNameRef} />
            <PersonListComponent 
                setFirstPersonNameRef={setFirstPersonNameRef} />
            <View style={styles.outputContainer}>
                <HideWithKeyboard>
                    <SwipeComponent onSwipe={saveAndClear} setRef={swipeableRef} text="Save" color="#00f500" swipeDirection="right">
                        <OutputComponent title="Totals" data={state} /> 
                    </SwipeComponent>
                </HideWithKeyboard>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1
    },
    outputContainer: {
        flex: 1,
        flexDirection: 'column', 
        justifyContent: 'flex-end',
    }
});

export default BillSplitter;