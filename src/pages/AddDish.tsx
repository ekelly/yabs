import React, { useState, useContext, useEffect } from "react";
import { Context as BillContext, Person, selectPeopleList } from "../context/BillContext";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import PersonSelectComponent from "../components/person-select/PersonSelectComponent";
import { Route, useNavigation } from "@react-navigation/native";
import { roundToTwoDecimals } from "../utils/NumberUtils";
import { ROUNDED_CORNER_RADIUS } from "../Constants";

type SelectedPeopleState = Set<string>;

function getItemSharePerPerson(itemCost: string,
                                       selectedPeople: SelectedPeopleState) {
    let itemCostPerPerson = parseFloat(itemCost) / selectedPeople.size;
    if (isNaN(itemCostPerPerson)) {
        itemCostPerPerson = 0;
    }
    return roundToTwoDecimals(itemCostPerPerson);
}

function getSharePerPerson(itemCost: string,
                           peopleList: Person[],
                           selectedPeople: SelectedPeopleState): Person[] {
    let itemCostPerPerson = getItemSharePerPerson(itemCost, selectedPeople);
    let singleDishShareList = peopleList.map<Person>((person) => {
        return {
            ...person,
            share: selectedPeople.has(person.id) ? itemCostPerPerson : 0
        }
    });

    return singleDishShareList;
}

interface AddDishParams {
    id?: string
}

interface AddDishProps {
    route: Route<"AddDish", AddDishParams>
}

const AddDish = ({ route }: AddDishProps): JSX.Element => {
    const { state, actions: { addShares } } = useContext(BillContext);
    const { id } = route.params;
    const navigation = useNavigation();
    const [itemCost, setItemCost] = useState("");

    let initiallySelectedPeople = new Set<string>();
    if (id) {
        initiallySelectedPeople.add(id);
    }

    const [selectedPeople, setSelectedPeople] = useState<SelectedPeopleState>(initiallySelectedPeople);
    
    let peopleList = selectPeopleList(state);

    let itemCostInput: TextInput | null;

    return (
        <TouchableOpacity 
            style={styles.background}
            onPress={navigation.goBack}
        >
        <View 
            style={styles.container} 
            onStartShouldSetResponder={(event) => true}
            onTouchEnd={(e) => {
                e.stopPropagation();
            }}>
            <View style={styles.header}>
                <Text style={styles.costText}>Item Cost: $ </Text>
                <TextInput
                    placeholder="00.00"
                    value={itemCost}
                    style={styles.costInput}
                    keyboardType="phone-pad"
                    onChangeText={setItemCost}
                    ref={(input) => {
                        itemCostInput = input;
                    }}
                    autoFocus
                />
            </View>
            <PersonSelectComponent 
                data={getSharePerPerson(itemCost, peopleList, selectedPeople)}
                initiallySelected={id}
                onCancel={() => { navigation.goBack() }} 
                onDone={() => {
                    addShares(getItemSharePerPerson(itemCost, selectedPeople), selectedPeople);
                    navigation.goBack();
                }}
                onTransactionDone={() => {
                    addShares(getItemSharePerPerson(itemCost, selectedPeople), selectedPeople);
                    setItemCost("");
                    setSelectedPeople(initiallySelectedPeople);
                    if (itemCostInput) {
                        itemCostInput.focus();
                    }
                }}
                onSelectionChanged={(selectedPeople) => {
                    let selectedPeopleSet = new Set<string>();
                    Object.entries(selectedPeople).forEach(value => {
                        if (value[1]) {
                            selectedPeopleSet.add(value[0]);
                        }
                    });
                    setSelectedPeople(selectedPeopleSet);
                }} />
        </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: ROUNDED_CORNER_RADIUS,
        flexDirection: 'column',
        justifyContent: 'center',
        borderColor: 'black',
        borderWidth: 1,
        alignItems: 'center',
    },
    header: {
        flexDirection: "row",
        width: '100%',
    },
    costText: {
        fontSize: 28,
        fontWeight: "bold"
    },
    costInput: {
        fontSize: 28,
    },
    background: {
        flex: 1,
        backgroundColor: '#0000007f',
        flexDirection: 'column',
        alignContent: 'flex-end'
    }
});

export default AddDish;