import React, { useContext } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Text } from "react-native-elements";
import { Context as BillContext } from "../context/BillContext";
import { ROUNDED_CORNER_RADIUS } from "../Constants";

const TotalBillComponent = () => {
    const { state: { total, description }, actions: { updateTotal, updateDescription } } = useContext(BillContext);

    return (
        <View style={styles.container}>
            <TextInput style={styles.header}
                placeholder="Bill Description"
                value={description}
                keyboardType="ascii-capable"
                onChangeText={updateDescription}
            />
            { total ? <Text style={styles.dollarSign}>$ </Text> : null }
            <TextInput
                placeholder="$$.$$"
                value={total}
                style={styles.costInput}
                keyboardType="phone-pad"
                onChangeText={updateTotal}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignContent: "space-between",
        backgroundColor: "#90EE90",
        borderRadius: ROUNDED_CORNER_RADIUS,
        padding: 10,
        marginBottom: 10
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        flex: 1
    },
    dollarSign: {
        fontSize: 28,
        fontWeight: "bold"
    },
    costInput: {
        fontSize: 28,
        alignContent: "center"
    }
});

export default TotalBillComponent;