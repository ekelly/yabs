import React, { useContext } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Text } from "react-native-elements";
import { Context as BillContext } from "../context/BillContext";
import { ROUNDED_CORNER_RADIUS } from "../Constants";
import { isNumeric, textToNumber } from "../utils/NumberUtils";

interface TotalBillComponentProps {
    firstNameInput: TextInput | null,
}

const TotalBillComponent = ({ firstNameInput }: TotalBillComponentProps) => {
    const { state: { stringTotal, description }, 
        actions: { updateTotal, updateDescription, updateStringTotal } } = useContext(BillContext);

    let textInput: TextInput | null;

    return (
        <View style={styles.container}>
            <TextInput style={styles.header}
                placeholder="Bill Description"
                value={description}
                keyboardType="ascii-capable"
                onChangeText={updateDescription}
                onSubmitEditing={() => { textInput?.focus(); }}
                blurOnSubmit={false}
                autoFocus
            />
            { stringTotal ? <Text style={styles.dollarSign}>$ </Text> : null }
            <TextInput
                placeholder="$$.$$"
                value={stringTotal}
                style={styles.costInput}
                keyboardType="phone-pad"
                ref={(input) => {
                    textInput = input;
                }}
                onChangeText={(text) => {
                    if (isNumeric(text)) {
                        updateStringTotal(text);
                    }
                }}
                onSubmitEditing={({ nativeEvent: { text }}) => {
                    let num = textToNumber(text);
                    if (num) {
                        updateTotal(num);
                    } else {
                        updateTotal(0);
                    }
                    firstNameInput?.focus();
                }}
                showSoftInputOnFocus
                blurOnSubmit={false}
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