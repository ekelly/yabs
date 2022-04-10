import React, { useContext } from "react";
import { View, Text, StyleSheet, Animated, FlatList } from "react-native";
import { Context as BillContext, Transaction, selectTransactionParticipants } from "../context/BillContext";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import { ROUNDED_CORNER_RADIUS } from "../Constants";

interface TransactionRowProps {
    transaction: Transaction
}

const TransactionRow = ({ transaction }: TransactionRowProps) => {
    const { state, actions: { deleteTransaction }} = useContext(BillContext);

    const swipeRenderer = (progress: Animated.AnimatedInterpolation,
                           dragAnimatedValue: Animated.AnimatedInterpolation) => {
        const opacity = dragAnimatedValue.interpolate({
            inputRange: [-150, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });
        return (
            <Animated.View style={[styles.swipedRow, {opacity}]}>
                <Animated.Text style={{alignSelf: "center"}}>Delete</Animated.Text>
            </Animated.View>
        );
    };

    const transactionParticipants = selectTransactionParticipants(state, transaction.id);

    return (
        <GestureHandlerRootView>
            <Swipeable
                renderRightActions={swipeRenderer}
                onSwipeableOpen={() => { deleteTransaction(transaction.id) }}>
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
            </Swipeable>
        </GestureHandlerRootView>
    );
}
  
const styles = StyleSheet.create({
    swipedRow: {
        backgroundColor: '#b60000',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        width: "100%"
    },
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