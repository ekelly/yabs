import React, { useContext, useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Text } from "react-native-elements";
import { Context as BillContext, getDisplayableTotal } from "../context/BillContext";
import { ROUNDED_CORNER_RADIUS } from "../Constants";
import { isNumeric, textToNumber } from "../utils/NumberUtils";

interface TotalBillComponentProps {
    firstNameInput: TextInput | null,
}

const TotalBillComponent = ({ firstNameInput }: TotalBillComponentProps) => {
    const { state: { total, description }, 
        actions: { updateTotal, updateDescription } } = useContext(BillContext);
    const [stringTotal, setStringTotal] = useState<string>(getDisplayableTotal(total));

    let textInput: TextInput | null;

    return (
        <View style={styles.container}>
            <TextInput style={styles.header}
                placeholder="Bill Description"
                value={description}
                keyboardType="ascii-capable"
                onChangeText={updateDescription}
                onSubmitEditing={() => {
                    if (textInput) {
                        textInput.focus();
                    }
                }}
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
                        setStringTotal(text);
                    }
                }}
                onEndEditing={({ nativeEvent: { text }}) => {
                    let num = textToNumber(text);
                    if (num) {
                        updateTotal(num);
                    } else {
                        updateTotal(0);
                    }
                    if (firstNameInput !== null) {
                        firstNameInput.focus();
                    }
                }}
                showSoftInputOnFocus
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