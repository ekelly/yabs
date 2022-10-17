import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Text } from "react-native-elements";
import { STYLES } from "../../Constants";
import { Person } from "../../context/BillContext";
import PersonSelectRow from "./PersonSelectRow";

type SelectedPeopleState = Record<string, boolean>;

type PersonSelectComponentProps = {
    onSelectionChanged: (selectedPeople: SelectedPeopleState) => void
    onDone: () => void,
    onCancel: () => void,
    onTransactionDone: () => void,
    initiallySelected?: string,
    data: Person[]
};

const PersonSelectComponent = ({ data, onCancel, onDone, onSelectionChanged, onTransactionDone, initiallySelected }: PersonSelectComponentProps) => {
    const [selectedPeople, setSelectedPeople] = useState<SelectedPeopleState>({});

    const initiallySelectedPeople: SelectedPeopleState = {};
    if (initiallySelected) {
        initiallySelectedPeople[initiallySelected] = true;
    }

    useEffect(() => {
        if (initiallySelected) {
            let newSelectedPeople = {
                [initiallySelected]: true
            };
            setSelectedPeople(newSelectedPeople);
        }
    }, [])

    const Header = () => <View style={styles.header}></View>;

    const Footer = () => <View style={styles.newPersonContainer}>
        <TouchableOpacity
            style={STYLES.button}
            onPress={onCancel}>
            <Text style={STYLES.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={STYLES.button}
            onPress={onDone}>
            <Text style={STYLES.buttonText}>Done</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={STYLES.button}
            onPress={() => {
                onTransactionDone();
                setSelectedPeople(initiallySelectedPeople);
            }}>
            <Text style={STYLES.buttonText}>Add Another</Text>
        </TouchableOpacity>
    </View>;

    return (
        <View style={styles.container}>
            <FlatList
                renderItem={({item}) => {
                    return <PersonSelectRow 
                        person={item} 
                        checked={selectedPeople[item.id]} 
                        onSelect={(selected) => {
                            let newSelectedPeople = {
                                ...selectedPeople,
                                [item.id]: selected
                            };
                            setSelectedPeople(newSelectedPeople);
                            onSelectionChanged(newSelectedPeople);
                        }} />;
                }}
                keyExtractor={(item) => item.id}
                data={data}
                style={styles.peopleList}
                ListHeaderComponent={Header}
            />
            <Footer />
        </View>
    );
}
  
const styles = StyleSheet.create({
    container: {
        width: '100%'
    },
    newPersonContainer: {
        marginVertical: 10,
        flexDirection: "row",
        justifyContent: "space-around"
    },
    header: {
        flexDirection: "row",
        borderBottomColor: "grey",
        borderBottomWidth: 2,
        paddingBottom: 3,
        alignContent: "space-between"
    },
    headerLabels: {
        fontStyle: "italic"
    },
    peopleList: {
        flexGrow: 0
    },
});

export default PersonSelectComponent;