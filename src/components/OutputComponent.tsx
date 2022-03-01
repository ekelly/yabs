import React, { useContext } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Button, Text } from "react-native-elements";
import { Context as BillContext, selectContributionPerPerson } from "../context/BillContext";
import launchVenmo from "../api/venmo";
import { ROUNDED_CORNER_RADIUS } from "../Constants"
import { AntDesign } from '@expo/vector-icons';
import { generateOutputString } from "../utils/GenerateOutput";
import { copyToClipboard } from "../utils/Clipboard";
import Share from "../components/Share";

const OutputComponent = () => {
    const { state } = useContext(BillContext);

    if (isNaN(parseFloat(state.total))) {
        return null;
    }

    let peopleList = selectContributionPerPerson(state);

    return (
        <View style={styles.outputContainer}>
            <Text h4>Totals</Text>
            <FlatList 
                renderItem={({item}) => {
                    let personTotal = isNaN(item.personTotal) ? "" : `${item.personTotal.toFixed(2)}`;
                    return (
                        <View style={styles.person}>
                            <Text style={styles.personName}>{item.name} - ${personTotal}</Text>
                            <Button 
                                title="Venmo"
                                onPress={() => {
                                    launchVenmo(parseFloat(item.personTotal.toFixed(2)), state.description);
                                }}
                            />
                            <Share itemId={item.id} state={state} />
                        </View>
                    );
                }}
                keyExtractor={(item) => item.id}
                data={peopleList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    outputContainer: {
        backgroundColor: "#dddddd",
        borderRadius: ROUNDED_CORNER_RADIUS,
        padding: 10,
        maxHeight: '50%'
    },
    person: {
        flexDirection: "row",
        marginVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#cdcdcd"
    },
    personName: {
        fontSize: 20,
        textAlignVertical: "center",
        flex: 1
    },
    copyIcon: {
        padding: 5,
        borderWidth: 1,
        backgroundColor: "blue"
    }
});

export default OutputComponent;