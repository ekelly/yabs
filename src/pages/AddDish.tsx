import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import PersonListComponent from "../components/person-list/PersonListComponent";

const BillSplitter = () => {

    const Header = () => {
        const [cost, setCost] = useState("");

        return (
            <View style={styles.container}>
                <Text style={styles.costText}>Cost: $</Text>
                <TextInput
                    placeholder="$$.$$"
                    value={cost}
                    style={styles.costInput}
                    keyboardType="phone-pad"
                    onChangeText={setCost}
                />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <PersonListComponent />
        </View>
    );
}
  
const styles = StyleSheet.create({
    container: {
        margin: 10,
        flex: 1
    },
    costText: {
        fontSize: 28,
        fontWeight: "bold"
    },
    costInput: {

    }
});

export default BillSplitter;