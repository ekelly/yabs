import React, { useContext, useState } from "react";
import { View, TextInput, StyleSheet, FlatList } from "react-native";
import { Button, Text, Input } from "react-native-elements";
import { Context as BillContext, selectPeopleList } from "../context/BillContext";

const PersonListComponent = () => {
    const [person, setPersonName] = useState("");
    const { state, actions: { addPerson, updateShare, updatePersonName }} = useContext(BillContext);

    let peopleList = selectPeopleList(state);
    console.log(peopleList);

    const Header = () => <View style={styles.header}>
        <Text h4 style={{...styles.headerLabels, flex: 1 }}>Name</Text>
        <Text h4 style={styles.headerLabels}>Shares</Text>
    </View>;

    const Footer = () => <View style={styles.newPersonContainer}>
        <Button
            title="Add Person"
            onPress={() => {
                if (person) {
                    addPerson(person);
                    setPersonName("");
                } else {
                    addPerson("Person " + (peopleList.length + 1));
                }
            }}
            style={styles.addPerson}
        />
    </View>;

    return (
        <View style={styles.container}>
            <FlatList
                renderItem={({item, index}) => {

                    let secondTextInput: TextInput | null;

                    return (
                        <View style={styles.person}>
                            <TextInput
                                placeholder={`Person ${index+1}`}
                                onChangeText={(text) => {
                                    updatePersonName(item.id, text);
                                }}
                                onEndEditing={() => { if (secondTextInput) { secondTextInput.focus(); }}}
                                value={item.name}
                                style={styles.personName}
                                selectTextOnFocus
                            />
                            <TextInput
                                ref={(input) => { secondTextInput = input; }}
                                keyboardType="phone-pad"
                                style={styles.costInput}
                                value={item.share}
                                selectTextOnFocus
                                onChangeText={(text) => {
                                    updateShare(item.id, text);
                                }}
                                placeholder="$$$$"
                            />
                        </View>
                    );
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
    person: {
        flexDirection: "row",
        marginVertical: 10
    },
    personName: {
        fontSize: 20,
        textAlignVertical: "center",
        flex: 1
    },
    newPersonContainer: {
        marginVertical: 10
    },
    newPerson: {
        fontSize: 20,
        flex: 1
    },
    addPerson: {
        
    },
    header: {
        flexDirection: "row",
        borderBottomColor: "grey",
        borderBottomWidth: 2,
        paddingBottom: 3
    },
    headerLabels: {
        fontStyle: "italic"
    },
    peopleList: {
        flexGrow: 0
    },
    costInput: {
        minWidth: 60,
        marginLeft: 10,
        alignSelf: "flex-end",
        fontSize: 20,
        textAlign: "right",

    }
});

export default PersonListComponent;