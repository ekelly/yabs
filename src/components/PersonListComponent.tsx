import React, { useContext, useState } from "react";
import { View, TextInput, StyleSheet, FlatList, TouchableOpacity, Animated } from "react-native";
import { Button, Text } from "react-native-elements";
import { Context as BillContext, selectPeopleList } from "../context/BillContext";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";

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

    const swipeRenderer = (progress: Animated.AnimatedInterpolation,
                           dragAnimatedValue: Animated.AnimatedInterpolation) => {
        const opacity = dragAnimatedValue.interpolate({
            inputRange: [-150, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });
        return (
            <Animated.View style={[styles.deleteButton, {opacity}]}>
                <Animated.Text>Archive</Animated.Text>
            </Animated.View>
        );
    };

    const swipeHandler = () => {
        console.log("Swiped! TODO: Delete person");
    };

    /**
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
     */

    return (
        <View style={styles.container}>
            <FlatList
                renderItem={({item, index}) => {

                    let secondTextInput: TextInput | null;

                    return (
                        <GestureHandlerRootView>
                            <Swipeable renderRightActions={swipeRenderer}>
                                <View style={styles.person}>
                                    <Text style={styles.personName}>{`Person ${index+1}`}</Text>
                                </View>
                            </Swipeable>
                        </GestureHandlerRootView>
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
    },
    swipedRow: {
        backgroundColor: 'red',
        height: "100%"
    },
    swipedConfirmationContainer: {
        flex: 1,
    },
    deleteConfirmationText: {
        color: '#fcfcfc',
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: '#b60000',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
    },
    deleteButtonText: {
        color: '#fcfcfc',
        fontWeight: 'bold',
        padding: 3,
    },
});

export default PersonListComponent;