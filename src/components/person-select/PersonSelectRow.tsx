import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CheckBox } from "react-native-elements";
import { Person } from "../../context/BillContext";

interface PersonRowProps {
    person: Person,
    checked: boolean,
    onSelect: (selected: boolean) => void
}

const PersonRow = ({ person, checked, onSelect }: PersonRowProps) => {
    return (
        <View style={styles.person}>
            <CheckBox
                center={false}
                checked={checked}
                title={<Text style={styles.personName}>{person.name}</Text>}
                containerStyle={styles.checkboxContainer}
                wrapperStyle={styles.checkboxWrapper}
                onPress={() => onSelect(!checked)}
            />
            <Text style={styles.personTotal}>{person.share}</Text>
        </View>
    );
}
  
const styles = StyleSheet.create({
    person: {
        flexDirection: "row",
        padding: 0
    },
    personName: {
        fontSize: 20,
        textAlignVertical: "center",
        marginLeft: 10
    },
    spacing: {
        flex: 1,
    },
    personTotal: {
        alignSelf: "flex-end",
        fontSize: 20,
        minWidth: 40,
        textAlign: "center",
        textAlignVertical: "center",
        height: "100%"
    },
    checkboxContainer: {
        flex: 1,
        backgroundColor: "transparent",
        borderWidth: 0
    },
    checkboxWrapper: {
        backgroundColor: "transparent"
    }
});

export default PersonRow;