import React from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, ViewStyle, Image } from "react-native";
import { Button, Text } from "react-native-elements";
import { selectContributionPerPerson, selectPeopleList, getTotalShares, BillState } from "../context/BillContext";
import launchVenmo from "../api/venmo";
import { ROUNDED_CORNER_RADIUS, BUTTON_COLOR, VENMO_COLOR } from "../Constants"
import Share from "../components/Share";
import { HistoryItem } from "../data/HistoryStore";
import { generateOutputString } from "../utils/GenerateOutput";

type OutputData = BillState | HistoryItem;

interface OutputComponentProps {
    shouldDisplay: boolean,
    title: string,
    data: OutputData,
    style?: ViewStyle,
    hasSave?: boolean
}

const OutputComponent = ({ shouldDisplay, title, data, style, hasSave }: OutputComponentProps) => {
    if (!shouldDisplay) {
        return null;
    }

    let people = selectPeopleList(data);
    let totalShares: number = getTotalShares(people);

    if (isNaN(data.total) || data.total === 0 || totalShares === 0) {
        return null;
    }

    let peopleList = selectContributionPerPerson(data);

    return (
        <View style={{ ...styles.outputContainer, ...style }}>
            <View style={styles.header}>
                <Text h3 style={styles.headerText}>{title} </Text>
                <Share shareText={generateOutputString(data)} style={styles.shareAllButton} hasTitle />
                { hasSave ? <Button
                    icon={{ name: "save", size: 30, type: 'fontawesome', color: "white" }}
                    title={""}
                    onPress={() => {  }}
                /> : null }
            </View>
            <FlatList 
                renderItem={({item}) => {
                    return (
                        <View style={styles.person}>
                            <Text style={styles.personName}>{item.name}: ${item.personTotal}</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    launchVenmo(parseFloat(item.personTotal), data.description);
                                }}
                                style={styles.venmoButton}
                            >
                                <Image
                                    style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                                    source={require('../../assets/Venmo_Logo_White_small.png')}
                                />
                            </TouchableOpacity> 
                            <Share shareText={generateOutputString(data, item.id)} style={{padding: 8}} />
                        </View>
                    );
                }}
                contentContainerStyle={{paddingBottom: 0}}
                keyExtractor={(item) => item.id}
                data={peopleList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
    },
    headerText: {
        flex: 1
    },
    outputContainer: {
        backgroundColor: "#dddddd",
        borderRadius: ROUNDED_CORNER_RADIUS,
        padding: 10,
        borderColor: 'green',
        borderWidth: 1
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
        padding: 10,
        borderRadius: 3,
        width: 60,
        height: 40,
        backgroundColor: VENMO_COLOR,
        color: VENMO_COLOR
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