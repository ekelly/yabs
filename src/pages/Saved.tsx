import React, { useContext, useEffect, useState } from "react";
import { Context as HistoryContext } from "../context/HistoryContext";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { HistoryItem } from "../data/HistoryStore";
import OutputComponent from "../components/OutputComponent";
import { timestampToDate } from "../utils/DateUtils";
import { ROUNDED_CORNER_RADIUS } from "../Constants";

const Saved = () => {
    const { state: { store } } = useContext(HistoryContext);
    const [history, setHistory] = useState<Array<HistoryItem>>([]);
    const [fetchedHistory, setFetchedHistory] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            console.log("Loading history");
            let historyItems = await store.fetchHistory();
            if (historyItems) {
                console.log("Loaded history: " + historyItems.length);
                setHistory(historyItems);
            } else {
                setHistory([]);
            }
            setFetchedHistory(true);
        })();
    }, []);

    function generateOutput() {
        return (
            <View style={styles.container}>
                { history.length > 0 ? generateHistoryOutput() : generateNoItemsOutput() }
            </View>
        );
    }

    function generateHistoryOutput() {
        return (
            <View style={styles.container}>
                { history.length > 0 ? <FlatList
                    data={history}
                    renderItem={({ item }) => {
                        let timestamp = timestampToDate(item.timestamp).toDateString();
                        let description = item.description ? item.description : "Totals";
                        return (
                            <View style={styles.row}>
                                <OutputComponent shouldDisplay title={description} data={item} style={styles.output} />
                                <Text style={{ alignSelf: "flex-end", marginRight: 10 }}>{timestamp}</Text>
                            </View>
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