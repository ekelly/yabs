import React, { useContext, useEffect, useRef, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native";
import { Text } from "react-native-elements";
import { Context as BillContext, selectPeopleList, Person } from "../../context/BillContext";
import PersonRow from "./PersonRow";

interface PersonListComponentProps {
    setFirstPersonNameRef: (firstPersonName: TextInput | null) => void,
}

interface TextInputHolder {
    personId: string,
    input: TextInput | null;
    type: 'name' | 'money';
    elementId: string;
}

let inputListRef: { list: Array<TextInputHolder> } = { list: [] };

function addToInputList(input: TextInput | null, elementId: string, type: 'name' | 'money', personId: string) {
    let inputList = inputListRef.list;
    if (inputList.findIndex(item => item.elementId === elementId) !== -1) {
        inputList.map(item => {
            if (item.elementId === elementId || (item.personId === personId && item.type === type)) {
                return { elementId, type, input, personId }
            }
            return item;
        });
    } else {
        inputList.push({ elementId, type, input, personId });
    }
}

function clearStaleReferences(personIds: Array<string>) {
    inputListRef.list = [ ...inputListRef.list.filter(item => personIds.includes(item.personId)) ];
}

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

    useEffect(() => {
        clearStaleReferences(peopleList.map(person => person.id));
    }, [peopleList]);

    function nextFocus(elementId: string) {
        let inputList = inputListRef.list;
        let index = inputList.findIndex((value) => {
            return value.elementId === elementId;
        });
        if (index < 0) {
            // Not found
            return;
        }
        console.log(`Input list length: ${inputList.length}`);
        if (index < inputList.length) {
            if (index === inputList.length - 1) {
                console.log("Hit last item of the list. Hiding keyboard");
                // Last item of the list
                let currItem = inputList[index];
                currItem.input?.blur();
            } else {
                let nextItemIndex = index + 2;
                if (nextItemIndex >= inputList.length) {
                    nextItemIndex = nextItemIndex % (inputList.length - 1);
                }
                let nextItem = inputList[nextItemIndex];
                nextItem.input?.focus();
            }
        }
    }

    return (
        <View style={styles.container}>
            <Header />
            <FlatList
                renderItem={({item, index}: {item: Person, index: number}) => {
                    return <PersonRow 
                        person={item} 
                        index={index} 
                        setNameInputRef={(nameInput, id) => {
                            addToInputList(nameInput, id, 'name', item.id);
                            if (index === 0) setFirstPersonNameRef(nameInput);
                        }}
                        setContributionInputRef={(contributionInput, id) => {
                            addToInputList(contributionInput, id, 'money', item.id);
                        }}
                        onEndEditing={nextFocus}
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