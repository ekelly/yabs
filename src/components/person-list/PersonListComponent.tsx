import React, { useContext, useRef, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native";
import { Text } from "react-native-elements";
import { Context as BillContext, selectPeopleList } from "../../context/BillContext";
import PersonRow from "./PersonRow";

interface PersonListComponentProps {
    setFirstPersonNameRef: (firstPersonName: TextInput | null) => void,
}

// Focus order: Name -> Contribution -> Name 2 -> Contribution 2 ...
let inputList: Array<{ input: TextInput | null, elementId: string }> = [];
const addToInputList = (elementId: string, input: TextInput | null) => {
    inputList.push({ elementId, input });
};
function transitionToNextFocusElement(elementId: string) {
    let indexOfElement = inputList.findIndex(value => elementId === value.elementId);
    let indexOfNextElement = indexOfElement + 1;
    if (indexOfNextElement < inputList.length) {
        // Focus on the next element
        let nextElement = inputList[indexOfNextElement].input;
        if (nextElement) {
            nextElement.focus();
        }
    }
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

    return (
        <View style={styles.container}>
            <Header />
            <FlatList
                renderItem={({item, index}) => {
                    return <PersonRow 
                        person={item} 
                        index={index} 
                        setNameInputRef={(nameInput, id) => {
                            addToInputList(id, nameInput);
                            if (index === 0) setFirstPersonNameRef(nameInput);
                        }}
                        setContributionInputRef={(contributionInput, id) => {
                            addToInputList(id, contributionInput);
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