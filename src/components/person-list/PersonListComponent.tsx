import React, { useContext, useRef, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native";
import { Text } from "react-native-elements";
import { Context as BillContext, selectPeopleList } from "../../context/BillContext";
import PersonRow from "./PersonRow";

interface PersonListComponentProps {
    setFirstPersonNameRef: (firstPersonName: TextInput | null) => void,
}

interface TextInputHolder {
    input: TextInput | null;
    type: 'name' | 'money';
    elementId: string;
}

let moneyInputList: Array<TextInputHolder> = [];
let nameInputList: Array<TextInputHolder> = [];

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
        let indexOfElement = nameInputList.findIndex(value => elementId === value.elementId);
        let arrayOfElements = nameInputList;
        if (indexOfElement < 0) {
            indexOfElement = moneyInputList.findIndex(value => elementId === value.elementId);
            arrayOfElements = moneyInputList;            
        } else if (indexOfElement == nameInputList.length - 1) {
            // Switch lists
            indexOfElement = -1;
            arrayOfElements = moneyInputList;
        }
        let indexOfNextElement = indexOfElement + 1;
        
        if (indexOfNextElement < arrayOfElements.length) {
            // Focus on the next element
            let nextElement = arrayOfElements[indexOfNextElement].input;
            nextElement?.focus();
        } else if (indexOfElement == arrayOfElements.length - 1) {
            // This situation should only occur if we have run out of text inputs
            arrayOfElements[indexOfElement].input?.blur();
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
                                nameInputList.push({ elementId: id, input: nameInput, type: 'name' });
                            }
                            if (index === 0) setFirstPersonNameRef(nameInput);
                        }}
                        setContributionInputRef={(contributionInput, id) => {
                            if (!moneyInputList.map(item => item.elementId).includes(id)) {
                                moneyInputList.push({ elementId: id, input: contributionInput, type: 'money' });
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