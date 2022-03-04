import React, { useContext, useState } from "react";
import { View, TextInput, StyleSheet, FlatList, TouchableOpacity, Animated } from "react-native";
import { Button, Text } from "react-native-elements";
import { Context as BillContext, selectPeopleList } from "../../context/BillContext";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import PersonRow from "./PersonRow";

const PersonListComponent = () => {
    const [person, setPersonName] = useState("");
    const { state, actions: { addPerson, updateShare, updatePersonName, deletePerson }} = useContext(BillContext);

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
        />
    </View>;

    return (
        <View style={styles.container}>
            <FlatList
                renderItem={({item, index}) => {
                    return <PersonRow person={item} index={index} />;
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
    newPersonContainer: {
        marginVertical: 10
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
    }
});

export default PersonListComponent;