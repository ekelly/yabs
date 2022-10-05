import React, { useContext, useEffect, useState } from "react";
import { Context as HistoryContext } from "../context/HistoryContext";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import { HistoryItem } from "../data/HistoryStore";
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

    const fetchHistory = async () => {
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
        navigation.addListener('focus', fetchHistory);
        fetchHistory();
    }, [fetchedHistory]);

    function generateOutput() {
        return (
            <View style={styles.container}>
                { history.length > 0 ? generateHistoryOutput() : generateNoItemsOutput() }
            </View>
        );
    }

    function generateHeader() {
        return <View style={styles.header}>
            <Header title="Saved Bills" />
            <Button
                icon={{ name: 'clear-all', size: 30, type: 'MaterialIcons', color: "white" }}
                onPress={createAlert}
                style={STYLES.button}
            />
        </View>
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
                    fetchHistory();
                }
              }
            ],
            { cancelable: true }
          );
    }

    function generateHistoryOutput() {
        return (
            <View style={styles.container}>
                { generateHeader() }
                { history.length > 0 ? <FlatList
                    data={history}
                    renderItem={({ item }) => {
                        let timestamp = timestampToDate(item.timestamp).toDateString();
                        let description = `${item.description ? item.description : "Total"}: ${penniesToOutput(item.total)}`;
                        return (
                            <SwipeDeleteComponent onDelete={() => {
                                store.deleteItem(item.id);
                                setFetchedHistory(false);
                            }}>
                                <View style={styles.row}>
                                    <OutputComponent shouldDisplay title={description} data={item} style={styles.output} />
                                    <Text style={{ alignSelf: "flex-end", marginRight: 10 }}>{timestamp}</Text>
                                </View>
                            </SwipeDeleteComponent>
                        );
                    }}
                    keyExtractor={(item) => item.id }
                /> : <Text style={{ fontSize: 30 }}>No saved items</Text> }
            </View>
        );
    }

    function generateNoItemsOutput() {
        return <Text style={{ fontSize: 30 }}>No saved items</Text>;
    }

    function generateLoadingOutput() {
        // return <Text style={{ fontSize: 30 }}>Loading...</Text>;
        return null;
    }

    if (fetchedHistory) {
        return generateOutput();
    } else {
        return generateLoadingOutput();
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
        backgroundColor: "lightgrey",
        borderRadius: ROUNDED_CORNER_RADIUS
    }
});

export default Saved;