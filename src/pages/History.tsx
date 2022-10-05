import React, { useContext } from "react";
import { Context as BillContext, selectHistory } from "../context/BillContext";
import { View, Text, StyleSheet, FlatList } from "react-native";
import TransactionRow from "../components/TransactionRow";
import Header from "../components/Header";

const History = () => {
    const { state, actions: { } } = useContext(BillContext);
    
    let transactionList = selectHistory(state);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header title="Transaction History" />
            </View>
            { transactionList.length ? <FlatList
                data={transactionList}
                renderItem={({ item }) => <TransactionRow transaction={item} />}
                keyExtractor={transaction => transaction.id}
            /> : <View style={styles.noItemsContainer}>
                <Text style={styles.noItemsText}>No history</Text>
            </View>}
        </View>
    );
}
  
const styles = StyleSheet.create({
    container: {
        margin: 10,
        flex: 1
    },
    header: {
        flexDirection: "row"
    },
    noItemsContainer: {
        flex: 1,
        alignContent: "center",
        justifyContent: "center"
    },
    noItemsText: {
        fontSize: 20,
        alignSelf: "center"
    }
});

export default History;