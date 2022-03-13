import React, { useState, useContext } from "react";
import { Context as BillContext, Person, selectPeopleList } from "../context/BillContext";
import { View, Text, StyleSheet, TextInput } from "react-native";
import PersonSelectComponent from "../components/person-select/PersonSelectComponent";
import { useNavigation } from "@react-navigation/native";

type SelectedPeopleState = Set<string>;

function getItemCostPerPerson(itemCost: string,
                              selectedPeople: SelectedPeopleState) {
    let itemCostPerPerson = parseFloat(itemCost) / selectedPeople.size;
    if (isNaN(itemCostPerPerson)) {
        itemCostPerPerson = 0;
    }
    return itemCostPerPerson.toFixed(2);
}

function getCostPerPerson(itemCost: string,
                          peopleList: Person[],
                          selectedPeople: SelectedPeopleState) {
    let itemCostPerPerson = getItemCostPerPerson(itemCost, selectedPeople);
    let singleDishShareList = peopleList.map<Person>((value) => {
        return {
            ...value,
            share: selectedPeople.has(value.id) ? itemCostPerPerson : "0"
        }
    });

    return singleDishShareList;
}

const AddDish = () => {
    const { state, actions: { addShares } } = useContext(BillContext);
    const navigation = useNavigation();
    const [itemCost, setItemCost] = useState("");
    const [selectedPeople, setSelectedPeople] = useState<SelectedPeopleState>(new Set<string>());
    
    let peopleList = selectPeopleList(state);

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
                />
            </View>
            <PersonSelectComponent 
                data={getCostPerPerson(itemCost, peopleList, selectedPeople)}
                onCancel={() => { navigation.goBack() }} 
                onDone={() => {
                    addShares(getItemCostPerPerson(itemCost, selectedPeople), selectedPeople);
                    navigation.goBack();
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