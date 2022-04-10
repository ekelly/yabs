import React, { useContext, useEffect } from "react";
import { Context as BillContext, Person, selectHistory } from "../context/BillContext";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import TransactionRow from "../components/TransactionRow";

const History = () => {
    const { state, actions: { } } = useContext(BillContext);
    const navigation = useNavigation();
    
    let transactionList = selectHistory(state);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
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