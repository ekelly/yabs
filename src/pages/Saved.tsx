import React, { useContext } from "react";
import { Context as BillContext } from "../context/BillContext";
import { View, Text, StyleSheet, FlatList } from "react-native";

const Saved = () => {
    const { state, actions: { } } = useContext(BillContext);

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 30 }}>Coming soon!</Text>
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

export default Saved;