import React, { useContext, useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Animated, TouchableOpacity } from "react-native";
import { Context as BillContext, Person, getDisplayableTotal } from "../../context/BillContext";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import { isNumeric } from "../../utils/NumberUtils";
import { useNavigation, CommonActions } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface PersonRowProps {
    person: Person,
    index: number,
    setNameInputRef: (nameInput: TextInput | null, id: string) => void,
    setContributionInputRef: (contributionInput: TextInput | null, id: string) => void,
    setEditsInProgress: (editsInProgress: boolean) => void,
    onEndEditing: (elementId: string) => void
}

const PersonRow = ({ person, index, setNameInputRef, setContributionInputRef, setEditsInProgress, onEndEditing }: PersonRowProps) => {
    const navigation = useNavigation();
    const { state, actions: { updateShare, updatePersonName, deletePerson }} = useContext(BillContext);
    const [personShare, setPersonShare] = useState<string>(""+person.share);

    useEffect(() => {
        setPersonShare(""+person.share);
    }, [person, state.transactions]);

    const swipeRenderer = (progress: Animated.AnimatedInterpolation,
                           dragAnimatedValue: Animated.AnimatedInterpolation) => {
        const opacity = dragAnimatedValue.interpolate({
            inputRange: [-150, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });
        return (
            <Animated.View style={[styles.swipedRow, {opacity}]}>
                <Animated.Text style={{alignSelf: "center"}}>Delete</Animated.Text>
            </Animated.View>
        );
    };

    return (
        <GestureHandlerRootView>
            <Swipeable
                renderRightActions={swipeRenderer} 
                onSwipeableOpen={() => { deletePerson(person.id) }}>
                <View style={styles.person}>
                    <TextInput
                        placeholder={`Person ${index+1}`}
                        onChangeText={(text) => {
                            updatePersonName(person.id, text);
                        }}
                        onEndEditing={() => { onEndEditing(person.id); }}
                        value={person.name}
                        style={styles.personName}
                        ref={(input) => {
                            setNameInputRef(input, person.id);
                        }}
                        selectTextOnFocus
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
                        onEndEditing={({ nativeEvent: { text }}) => {
                            if (isNumeric(text)) {
                                updateShare(person.id, parseFloat(text));
                            }
                            onEndEditing(person.id + "-share");
                        }}
                        onFocus={() => setEditsInProgress(true) }
                        onBlur={() => setEditsInProgress(false) }
                        placeholder="$$$$"
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
            </Swipeable>
        </GestureHandlerRootView>
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
    },
    swipedRow: {
        backgroundColor: '#b60000',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        width: "100%"
    },
    plusIcon: {
        marginLeft: 10
    }
});

export default PersonRow;