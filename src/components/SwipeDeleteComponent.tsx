import React from "react";
import { View, Text, StyleSheet, Animated, FlatList } from "react-native";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import { ROUNDED_CORNER_RADIUS } from "../Constants";

interface SwipeDeleteComponentProps {
    onDelete: () => void,
    children: JSX.Element
}

const SwipeDeleteComponent = ({ onDelete, children }: SwipeDeleteComponentProps) => {

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
                onSwipeableOpen={onDelete}>
                {children}
            </Swipeable>
        </GestureHandlerRootView>
    );
}
  
const styles = StyleSheet.create({
    swipedRow: {
        backgroundColor: '#b60000',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        width: "100%"
    },
    row: {
        padding: 10,
        margin: 10,
        borderWidth: 1,
        borderRadius: ROUNDED_CORNER_RADIUS
    },
    rowText: {
        fontSize: 20
    }
});

export default SwipeDeleteComponent;