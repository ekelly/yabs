import React from "react";
import { StyleSheet, Platform } from "react-native";
import { Button } from "react-native-elements";
import { generateOutputString } from "../utils/GenerateOutput";
import { Share as NativeShare } from 'react-native';
import { BillState } from "../context/BillContext";

const share = async (text: string): Promise<boolean> => {
    try {
        const result = await NativeShare.share({
            message: text,
        });
        return result.action === NativeShare.sharedAction;
    } catch (error) {
        return false;
    }
};

type ShareProps = {
    state: BillState,
    itemId: string
};

const Share = ({ state, itemId }: ShareProps) => {
    return <Button 
        icon={{ name: Platform.OS === 'ios' ? "share-apple" : "share-google", size: 30, type: 'evilicon', color: "white" }}
        onPress={() => {
            let shareString = generateOutputString(state, itemId);
            share(shareString);
        }}
        style={styles.copyIcon}
    />;
};

const styles = StyleSheet.create({
    copyIcon: {
        padding: 5,
        borderWidth: 1,
    }
});

export default Share;