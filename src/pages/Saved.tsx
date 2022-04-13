import React, { useContext, useEffect, useState } from "react";
import { Context as HistoryContext } from "../context/HistoryContext";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { HistoryItem } from "../data/HistoryStore";
import OutputComponent from "../components/OutputComponent";

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
                        return <OutputComponent shouldDisplay title={item.description} data={item} style={styles.row} />;
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

    return (<>{ fetchedHistory ? generateOutput() : generateLoadingOutput() }</>);
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        marginHorizontal: 5,
        flex: 1
    },
    row: {
        marginBottom: 15,
        marginHorizontal: 0,
    }
});

export default Saved;