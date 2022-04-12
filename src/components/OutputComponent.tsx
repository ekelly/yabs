import React, { useContext } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Text } from "react-native-elements";
import { Context as BillContext, selectContributionPerPerson, selectPeopleList, getTotalShares } from "../context/BillContext";
import launchVenmo from "../api/venmo";
import { ROUNDED_CORNER_RADIUS, BUTTON_COLOR } from "../Constants"
import Share from "../components/Share";

interface OutputComponentProps {
    shouldDisplay: boolean,
    title: string
}

const OutputComponent = ({ shouldDisplay, title }: OutputComponentProps) => {
    if (!shouldDisplay) {
        return null;
    }

    const { state } = useContext(BillContext);

    let people = selectPeopleList(state);
    let totalShares: number = getTotalShares(people);

    if (isNaN(state.total) || state.total === 0 || totalShares === 0) {
        return null;
    }

    let peopleList = selectContributionPerPerson(state);

    return (
        <View style={styles.outputContainer}>
            <View style={styles.header}>
                <Text h3>{title} </Text>
                <Share state={state} style={styles.shareAllButton} hasTitle />
            </View>
            <FlatList 
                renderItem={({item}) => {
                    return (
                        <View style={styles.person}>
                            <Text style={styles.personName}>{item.name} - ${item.personTotal}</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    launchVenmo(parseFloat(item.personTotal), state.description);
                                }}
                                style={styles.venmoButton}
                            >
                                <Text style={styles.venmoText}>Venmo</Text>
                            </TouchableOpacity> 
                            <Share itemId={item.id} state={state} style={{padding: 8}} />
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
    header: {
        flexDirection: "row"
    },
    outputContainer: {
        backgroundColor: "#dddddd",
        borderRadius: ROUNDED_CORNER_RADIUS,
        padding: 10,
        maxHeight: '50%'
    },
    person: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#cdcdcd"
    },
    personName: {
        fontSize: 20,
        textAlignVertical: "center",
        alignSelf: "flex-start",
        flex: 1,
        marginTop: 10
    },
    venmoButton: {
        marginRight: 10,
        borderRadius: 3,
        backgroundColor: BUTTON_COLOR,
        color: BUTTON_COLOR
    },
    venmoText: {
        fontSize: 22,
        padding: 5,
        color: "white"
    },
    shareAllButton: {
        paddingLeft: 0,
        backgroundColor: "purple"
    }
});

export default OutputComponent;