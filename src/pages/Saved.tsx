import React, { useContext, useEffect, useState } from "react";
import { Context as HistoryContext } from "../context/HistoryContext";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import { HistoryItem, HistoryStore } from "../data/HistoryStore";
import OutputComponent from "../components/OutputComponent";
import { timestampToDate } from "../utils/DateUtils";
import { MARGIN, ROUNDED_CORNER_RADIUS, STYLES } from "../Constants";
import { useNavigation } from "@react-navigation/native";
import SwipeDeleteComponent from "../components/SwipeDeleteComponent";
import { penniesToOutput } from "../utils/PriceUtils";
import { Button } from "react-native-elements";
import Header from "../components/Header";

const Saved = () => {
    const { state: { store } } = useContext(HistoryContext);
    const [history, setHistory] = useState<Array<HistoryItem>>([]);
    const [fetchedHistory, setFetchedHistory] = useState<boolean>(false);
    const navigation = useNavigation();

    const fetchHistory = async (store: HistoryStore) => {
        console.log("Loading history");
        let historyItems = await (await store.fetchHistory()).filter(item => item.people.length > 0 && item.total !== 0);
        if (historyItems) {
            console.log("Loaded history: " + historyItems.length);
            setHistory(historyItems);
        } else {
            setHistory([]);
        }
        setFetchedHistory(true);
    };

    useEffect(() => {
        return navigation.addListener('focus', () => fetchHistory(store));
    }, [store]);

    useEffect(() => {
        if (!fetchedHistory) {
            fetchHistory(store);
        }
    }, [fetchedHistory, store]);

    function generateOutput() {
        return (
            <View style={styles.container}>
                { generateHeader(history.length > 0) }
                { history.length > 0 ? generateHistoryOutput() : generateNoItemsOutput() }
            </View>
        );
    }

    function createAlert() {
        Alert.alert(
            "Clear All",
            "Are you sure you want to delete all saved items?",
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              { text: "OK", 
                onPress: async () => { 
                    await store.deleteAll();
                    setFetchedHistory(false);
                }
              }
            ],
            { cancelable: true }
          );
    }

    function generateHeader(showClearAll: boolean) {
        return (<View style={styles.header}>
            <Header title="Saved Bills" />
            { showClearAll ? 
            <Button
                icon={{ name: 'clear-all', size: 30, type: 'MaterialIcons', color: "white" }}
                onPress={createAlert}
                style={STYLES.button} />
                : null }
        </View>);
    }

    function generateHistoryOutput() {
        return (<FlatList
                    data={history}
                    renderItem={({ item }) => {
                        let timestamp = timestampToDate(item.timestamp).toDateString();
                        let description = `${item.description ? item.description : "Total"}: ${penniesToOutput(item.total)}`;
                        return (
                                <View style={styles.row}>
                                    <SwipeDeleteComponent onDelete={() => {
                                        store.deleteItem(item.id);
                                        setFetchedHistory(false);
                                    }}>
                                        <View style={styles.savedBill}>
                                        <OutputComponent title={description} data={item} style={styles.output} />
                                        <Text style={{ alignSelf: "flex-end", marginRight: 10 }}>{timestamp}</Text>
                                        </View>
                                    </SwipeDeleteComponent>
                                </View>
                            
                        );
                    }}
                    keyExtractor={(item) => item.id }
                />
        );
    }

    function generateNoItemsOutput() {
        return (<View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
            <Text style={{ fontSize: 20, textAlign: 'center' }}>No saved items</Text>
        </View>);
    }

    if (fetchedHistory) {
        return generateOutput();
    } else {
        return null;
    }
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 0,
        marginHorizontal: 0,
        flex: 1
    },
    header: {
        flexDirection: "row",
        margin: MARGIN,
    },
    headerButton: {
        alignSelf: 'flex-end'
    },
    output: {
        marginHorizontal: 0,
        backgroundColor: "transparent",
        borderRadius: 0,
        paddingBottom: 0,
    },
    row: {
        marginBottom: 15,
        marginHorizontal: 10,
    },
    savedBill: {
        backgroundColor: '#dddddd',
        borderRadius: ROUNDED_CORNER_RADIUS
    }
});

export default Saved;