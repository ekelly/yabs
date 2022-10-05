import { Platform, StyleSheet } from "react-native";

export const ROUNDED_CORNER_RADIUS = 10;

export const BUTTON_COLOR = Platform.OS === "ios" ? "#007AFF" : "#2196F3";

export const MARGIN = 10;

export const STYLES = StyleSheet.create({
    button: {
        backgroundColor: BUTTON_COLOR,
        borderRadius: 3,
        color: "white",
        padding: 10
    },
    buttonText: {
        color: "white"
    }
});