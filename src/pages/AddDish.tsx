import React, { useState, useContext, useEffect } from "react";
import { Context as BillContext, Person, selectPeopleList } from "../context/BillContext";
import { View, Text, StyleSheet, TextInput } from "react-native";
import PersonSelectComponent from "../components/person-select/PersonSelectComponent";
import { Route, useNavigation } from "@react-navigation/native";

type SelectedPeopleState = Set<string>;

function getItemSharePerPerson(itemCost: string,
                                       selectedPeople: SelectedPeopleState) {
    let itemCostPerPerson = parseFloat(itemCost) / selectedPeople.size;
    if (isNaN(itemCostPerPerson)) {
        itemCostPerPerson = 0;
    }
    return itemCostPerPerson;
}

function getSharePerPerson(itemCost: string,
                           peopleList: Person[],
                           selectedPeople: SelectedPeopleState) {
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

const AddDish = ({ route }: AddDishProps) => {
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
        <View style={styles.container}>
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
    costText: {
        fontSize: 28,
        fontWeight: "bold"
    },
    costInput: {
        fontSize: 28,
    }
});

export default AddDish;