import React, { useContext, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native";
import { Text } from "react-native-elements";
import { Context as BillContext, selectPeopleList } from "../../context/BillContext";
import PersonRow from "./PersonRow";
import { useNavigation } from "@react-navigation/native";

const PersonListComponent = () => {
    const { state, actions: { addPerson }} = useContext(BillContext);
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

    return (
        <View style={styles.container}>
            <FlatList
                renderItem={({item, index}) => {
                    return <PersonRow person={item} index={index} setNameInputRef={(nameInput, id) => {
                        
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