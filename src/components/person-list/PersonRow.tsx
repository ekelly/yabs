import React, { useContext } from "react";
import { View, TextInput, StyleSheet, Animated } from "react-native";
import { Context as BillContext, Person } from "../../context/BillContext";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import { Button } from "react-native-elements/dist/buttons/Button";
import { Icon } from "react-native-elements";

interface PersonRowProps {
    person: Person,
    index: number
}

const PersonRow = ({ person, index }: PersonRowProps) => {
    const { state, actions: { updateShare, updatePersonName, deletePerson }} = useContext(BillContext);

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

    let secondTextInput: TextInput | null;

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
                        onEndEditing={() => { if (secondTextInput) { secondTextInput.focus(); }}}
                        value={person.name}
                        style={styles.personName}
                        selectTextOnFocus
                    />
                    <View style={{flex: 1}} />
                    <TextInput
                        ref={(input) => { secondTextInput = input; }}
                        keyboardType="phone-pad"
                        style={styles.costInput}
                        value={person.share}
                        selectTextOnFocus
                        onChangeText={(text) => {
                            updateShare(person.id, text);
                        }}
                        placeholder="$$$$"
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