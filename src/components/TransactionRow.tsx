import React, { useContext } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Context as BillContext, Transaction, selectTransactionParticipants } from "../context/BillContext";
import { ROUNDED_CORNER_RADIUS } from "../Constants";
import SwipeDeleteComponent from "./SwipeDeleteComponent";

interface TransactionRowProps {
    transaction: Transaction
}

const TransactionRow = ({ transaction }: TransactionRowProps) => {
    const { state, actions: { deleteTransaction }} = useContext(BillContext);

    const transactionParticipants = selectTransactionParticipants(state, transaction.id);

    return (
        <SwipeDeleteComponent onDelete={() => deleteTransaction(transaction.id)}>
            <FlatList
                data={transactionParticipants}
                renderItem={({ item }) => {
                    let adjustment = transaction.adjustments.find(adjustment => adjustment.id === item.id);
                    if (adjustment) {
                        let amt = adjustment.adjustAmount;
                        return (<View style={styles.row}>
                                <Text style={styles.rowText}>{item.name}: {amt > 0 ? "+" : ""}{amt}</Text>
                            </View>);
                    } else {
                        return null;
                    }
                }}
                keyExtractor={transactionParticipant => transactionParticipant.id}
            />
        </SwipeDeleteComponent>
    );
}
  
const styles = StyleSheet.create({
    row: {
        padding: 10,
        margin: 10,
        borderWidth: 1,
        borderRadius: ROUNDED_CORNER_RADIUS
    },
    rowText: {
        fontSize: 20
    }
});

export default TransactionRow;