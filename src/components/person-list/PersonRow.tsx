import React, { useContext, useState, useEffect } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Context as BillContext, Person } from "../../context/BillContext";
import { Context as HistoryContext } from "../../context/HistoryContext";
import { isNumeric } from "../../utils/NumberUtils";
import { useNavigation, CommonActions } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SwipeDeleteComponent from "../SwipeDeleteComponent";

interface PersonRowProps {
    person: Person,
    index: number,
    setNameInputRef: (nameInput: TextInput | null, id: string) => void,
    setContributionInputRef: (contributionInput: TextInput | null, id: string) => void,
    onEndEditing: (elementId: string) => void
}

const PersonRow = ({ person, index, setNameInputRef, setContributionInputRef, onEndEditing }: PersonRowProps) => {
    const navigation = useNavigation();
    const { state, actions: { updateShare, updatePersonName, deletePerson }} = useContext(BillContext);
    const { state: { store }} = useContext(HistoryContext);
    const [personShare, setPersonShare] = useState<string>(""+person.share);

    useEffect(() => {
        setPersonShare(""+person.share);
    }, [person, state.transactions]);

    return (
        <SwipeDeleteComponent onDelete={() => {
            deletePerson(person.id);
            store.deletePersonFromBill(person.id, state.id);
        }}>
            <View style={styles.person}>
                <TextInput
                    placeholder={`Person ${index+1}`}
                    onChangeText={(text) => {
                        updatePersonName(person.id, text);
                    }}
                    onSubmitEditing={() => { onEndEditing(person.id); }}
                    value={person.name}
                    style={styles.personName}
                    ref={(input) => {
                        setNameInputRef(input, person.id);
                    }}
                    selectTextOnFocus
                    blurOnSubmit={false}
                />
                <View style={{flex: 1}} />
                <TextInput
                    ref={(input) => { 
                        setContributionInputRef(input, person.id + "-share");
                    }}
                    keyboardType="phone-pad"
                    style={styles.costInput}
                    value={personShare}
                    selectTextOnFocus
                    onChangeText={(text) => {
                        if (isNumeric(text)) {
                            setPersonShare(text);
                        }
                    }}
                    onSubmitEditing={({ nativeEvent: { text }}) => {
                        if (isNumeric(text) && !isNaN(parseFloat(text))) {
                            updateShare(person.id, parseFloat(text));
                        } else if ("" === text) {
                            // If the user deleted everything, assume they meant to do 0
                            updateShare(person.id, 0);
                            setPersonShare("0");
                        } else {
                            // Reset it to the last value
                            setPersonShare(""+person.share);
                        }
                        onEndEditing(person.id + "-share");
                    }}
                    placeholder="$$$$"
                    blurOnSubmit={false}
                />
                <Icon
                    name="tag-plus"
                    size={32}
                    onPress={() => {
                        navigation.dispatch(CommonActions.navigate({
                            name: "AddDish",
                            params: {
                                id: person.id
                            }
                        }));
                    }}
                />
            </View>
        </SwipeDeleteComponent>
    );
}
  
const styles = StyleSheet.create({
    person: {
        flexDirection: "row",
        marginVertical: 10
    },
    personName: {
        fontSize: 20,
        textAlignVertical: "center"
    },
    costInput: {
        alignSelf: "flex-end",
        fontSize: 20,
        textAlign: "right",
        marginRight: 10
    }
});

export default PersonRow;