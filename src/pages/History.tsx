import React, { useContext } from "react";
import { Context as BillContext, Person, selectHistory } from "../context/BillContext";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import TransactionRow from "../components/TransactionRow";

const History = () => {
    const { state, actions: { } } = useContext(BillContext);
    const navigation = useNavigation();
    
    let transactionList = selectHistory(state);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
            </View>
            <FlatList
                data={transactionList}
                renderItem={({ item }) => <TransactionRow transaction={item} />}
                keyExtractor={transaction => transaction.id}
            />
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
});

export default History;