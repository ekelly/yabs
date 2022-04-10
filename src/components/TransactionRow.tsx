import React, { useContext } from "react";
import { Text, StyleSheet, Animated, FlatList } from "react-native";
import { Context as BillContext, Transaction, selectTransactionParticipants } from "../context/BillContext";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";

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
                            return <Text>{item.name} - {adjustment.adjustAmount}</Text>
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
});

export default TransactionRow;