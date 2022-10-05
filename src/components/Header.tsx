import React from "react";
import { Text, StyleSheet } from "react-native";

interface HeaderProps {
    title: string
}

const Header = ({ title }: HeaderProps) => {
    return (
        <Text style={styles.headerText}>
            {title}
        </Text>
    );
}
  
const styles = StyleSheet.create({
    headerText: {
        fontSize: 32,
        flex: 1,
        height: 50,
    }
});

export default Header;