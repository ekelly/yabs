import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native";
import { Text } from "react-native-elements";
import { Context as BillContext, selectPeopleList } from "../../context/BillContext";
import PersonRow from "./PersonRow";

interface PersonListComponentProps {
    setEditsInProgress: (editsInProgress: boolean) => void,
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

const PersonListComponent = ({ setEditsInProgress, setFirstPersonNameRef }: PersonListComponentProps) => {
    const { state, actions: { addPerson }} = useContext(BillContext);
    const [editingInProgress, setEditingInProgress] = useState<Array<string>>([]);

    let peopleList = selectPeopleList(state);

    const Header = () => <View style={styles.header}>
        <Text h4 style={{...styles.headerLabels, flex: 1 }}>Name</Text>
        <Text h4 style={styles.headerLabels}>Contribution</Text>
    </View>;

    const Footer = () => <View style={styles.newPersonContainer}>
        <TouchableOpacity
            onPress={() => {
                addPerson("Person " + (peopleList.length + 1));
            }}
        >
            <Text style={styles.addPerson}>Add Person</Text>
        </TouchableOpacity>
    </View>;

    useEffect(() => {
        if (editingInProgress.length > 0) {
            setEditsInProgress(true);
        } else {
            // TODO: We need to account for the delay of switching between different
            // text inputs so that the totals box doesn't flicker
            setEditsInProgress(editingInProgress.length > 0);
        }
    }, [editingInProgress]);

    return (
        <View style={styles.container}>
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
                        setEditsInProgress={(isEditInProgress) => {
                            if (isEditInProgress) {
                                setEditingInProgress([...editingInProgress, item.id]);
                            } else {
                                setEditingInProgress([...editingInProgress].filter(pid => pid !== item.id));
                            }
                        }} />;
                }}
                keyExtractor={(item) => item.id}
                data={peopleList}
                style={styles.peopleList}
                ListHeaderComponent={Header}
            />
            <Footer />
        </View>
    );
}
  
const styles = StyleSheet.create({
    container: {
        flex: 1
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
        borderColor: "black",
        borderWidth: 0,
    }
});

export default PersonListComponent;