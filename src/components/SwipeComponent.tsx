import React from "react";
import { StyleSheet, Animated, ViewStyle } from "react-native";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";

export type SwipeDirection = 'left' | 'right';

interface SwipeComponentProps {
    onSwipe: () => void,
    children: JSX.Element,
    text?: string,
    color: string,
    style?: ViewStyle | undefined,
    swipeStyle?: ViewStyle | undefined,
    swipeDirection?: SwipeDirection,
    setRef?: React.RefObject<Swipeable>
}

const SwipeComponent = ({ onSwipe, children, text, color, style, swipeStyle, swipeDirection, setRef }: SwipeComponentProps) => {

    const noOpSwipeRenderer = (progress: Animated.AnimatedInterpolation,
                               dragAnimatedValue: Animated.AnimatedInterpolation) => {
        return null;
    }

    const swipeRenderer = (progress: Animated.AnimatedInterpolation,
                           dragAnimatedValue: Animated.AnimatedInterpolation) => {
        let opacity = null;
        if (swipeDirection === 'right') {
            opacity = dragAnimatedValue.interpolate({
                inputRange: [0, 150],
                outputRange: [0, 1],
                extrapolate: 'clamp',
            });
        } else {
            opacity = dragAnimatedValue.interpolate({
                inputRange: [-150, 0],
                outputRange: [1, 0],
                extrapolate: 'clamp',
            });
        }
        return (
            <Animated.View style={[{...styles.swipedRow, ...swipeStyle, backgroundColor: color, }, {opacity}]}>
                <Animated.Text style={styles.rowText}>{text}</Animated.Text>
            </Animated.View>
        );
    };

    return (
        <GestureHandlerRootView>
            { swipeDirection === 'right' ? <Swipeable
                renderLeftActions={swipeRenderer}
                renderRightActions={noOpSwipeRenderer}
                overshootLeft={false}
                ref={setRef}
                childrenContainerStyle={style}
                onSwipeableOpen={onSwipe}>
                {children}
            </Swipeable> : <Swipeable
                renderRightActions={swipeRenderer}
                renderLeftActions={noOpSwipeRenderer}
                overshootRight={false}
                ref={setRef}
                childrenContainerStyle={style}
                onSwipeableOpen={onSwipe}>
                {children}
            </Swipeable> }
        </GestureHandlerRootView>
    );
}
  
const styles = StyleSheet.create({
    swipedRow: {
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        width: "100%"
    },
    rowText: {
        fontSize: 20,
        alignSelf: "center"
    }
});

export default SwipeComponent;