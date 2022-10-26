import React, { useContext, useRef, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native";
import { Text } from "react-native-elements";
import { Context as BillContext, selectPeopleList } from "../../context/BillContext";
import PersonRow from "./PersonRow";

interface PersonListComponentProps {
    setFirstPersonNameRef: (firstPersonName: TextInput | null) => void,
}

let moneyInputList: Array<{ input: TextInput | null, elementId: string }> = [];
let nameInputList: Array<{ input: TextInput | null, elementId: string }> = [];

const PersonListComponent = ({ setFirstPersonNameRef }: PersonListComponentProps) => {
    const { state, actions: { addPerson }} = useContext(BillContext);
    const [shouldScrollList, setShouldScrollList] = useState(false);
    const listRef = useRef<FlatList|null>(null);

    let peopleList = selectPeopleList(state);

    const Header = () => <View style={styles.header}>
        <Text h4 style={{...styles.headerLabels, flex: 1 }}>Name</Text>
        <Text h4 style={styles.headerLabels}>Contribution</Text>
    </View>;

    const Footer = () => <View style={styles.newPersonContainer}>
        <TouchableOpacity
            onPress={() => {
                addPerson("Person " + (peopleList.length + 1));
                setShouldScrollList(true);
            }}
        >
            <Text style={styles.addPerson}>Add Person</Text>
        </TouchableOpacity>
    </View>;

    function transitionToNextFocusElement(elementId: string) {
        console.log(`Names: ${JSON.stringify(nameInputList.map(value => value.elementId))}`);
        console.log(`Moneys: ${JSON.stringify(moneyInputList.map(value => value.elementId))}`);
        let indexOfElement = nameInputList.findIndex(value => elementId === value.elementId);
        console.log(`Found ${elementId} at index ${indexOfElement} / ${nameInputList.length - 1}`);
        let arrayOfElements = nameInputList;
        if (indexOfElement < 0) {
            indexOfElement = moneyInputList.findIndex(value => elementId === value.elementId);
            console.log(`Actually found ${elementId} at index ${indexOfElement} / ${moneyInputList.length - 1}`);
            arrayOfElements = moneyInputList;            
        } else if (indexOfElement == nameInputList.length - 1) {
            console.log(`Switching lists`);
            // Switch lists
            indexOfElement = -1;
            arrayOfElements = moneyInputList;
        }
        let indexOfNextElement = indexOfElement + 1;
        
        if (indexOfNextElement < arrayOfElements.length) {
            // Focus on the next element
            let nextElement = arrayOfElements[indexOfNextElement].input;
            console.log(`Found ${nextElement}`);
            nextElement?.focus();
        }
    }

    return (
        <View style={styles.container}>
            <Header />
            <FlatList
                renderItem={({item, index}) => {
                    return <PersonRow 
                        person={item} 
                        index={index} 
                        setNameInputRef={(nameInput, id) => {
                            if (!nameInputList.map(item => item.elementId).includes(id)) {
                                nameInputList.push({ elementId: id, input: nameInput });
                            }
                            if (index === 0) setFirstPersonNameRef(nameInput);
                        }}
                        setContributionInputRef={(contributionInput, id) => {
                            if (!moneyInputList.map(item => item.elementId).includes(id)) {
                                moneyInputList.push({ elementId: id, input: contributionInput });
                            }
                        }}
                        onEndEditing={transitionToNextFocusElement}
                        />;
                }}
                ref={listRef}
                ListFooterComponent={Footer}
                keyExtractor={(item) => item.id}
                data={peopleList}
                onEndReachedThreshold={0.3}
                onEndReached={({ distanceFromEnd }) => {
                    if (shouldScrollList) {
                        listRef?.current?.scrollToEnd();
                        setShouldScrollList(false);
                    }
                }}
                style={styles.peopleList}
            />
        </View>
    );
}
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        flex: 1
    },
    newPersonContainer: {
        marginVertical: 10,
        flexDirection: "row",
    },
    addPerson: {
        fontStyle: "italic",
        color: "grey",
        minWidth: 150,
        fontSize: 22,
        textDecorationLine: "underline",
    }
});

export default PersonListComponent;