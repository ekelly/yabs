import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native";
import { Text } from "react-native-elements";
import { Context as BillContext, selectPeopleList } from "../../context/BillContext";
import PersonRow from "./PersonRow";
import { useNavigation } from "@react-navigation/native";

interface PersonListComponentProps {
    setEditsInProgress: (editsInProgress: boolean) => void
}

const PersonListComponent = ({ setEditsInProgress }: PersonListComponentProps) => {
    const { state, actions: { addPerson }} = useContext(BillContext);
    const [editingInProgress, setEditingInProgress] = useState<Array<string>>([]);
    const navigation = useNavigation();

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
            // TODO: We need to account for the delay if switching between different
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
                        
                        }}
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