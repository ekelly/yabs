import React, { useContext, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Text } from "react-native-elements";
import { STYLES } from "../../Constants";
import { Context as BillContext, selectPeopleList } from "../../context/BillContext";
import PersonRow from "./PersonRow";
import { useNavigation, CommonActions } from "@react-navigation/native";

const PersonListComponent = () => {
    const [person, setPersonName] = useState("");
    const { state, actions: { addPerson }} = useContext(BillContext);
    const navigation = useNavigation();

    let peopleList = selectPeopleList(state);

    console.log(state);

    const Header = () => <View style={styles.header}>
        <Text h4 style={{...styles.headerLabels, flex: 1 }}>Name</Text>
        <Text h4 style={styles.headerLabels}>Shares</Text>
    </View>;

    const Footer = () => <View style={styles.newPersonContainer}>
        <TouchableOpacity
            style={STYLES.button}
            onPress={() => {
                if (person) {
                    addPerson(person);
                    setPersonName("");
                } else {
                    addPerson("Person " + (peopleList.length + 1));
                }
            }}
        >
            <Text style={STYLES.buttonText}>Add Person</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={STYLES.button}
            onPress={() => {
                console.log("Adding a dish");
                navigation.dispatch(CommonActions.navigate({
                    name: "AddDish"
                }));
            }}
        >
            <Text style={STYLES.buttonText}>Add a Dish</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={STYLES.button}
            onPress={() => {
                console.log("History");
                navigation.dispatch(CommonActions.navigate({
                    name: "History"
                }));
            }}
        >
            <Text style={STYLES.buttonText}>History</Text>
        </TouchableOpacity>
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
        marginVertical: 10,
        flexDirection: "row",
        justifyContent: "space-around"
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
});

export default PersonListComponent;