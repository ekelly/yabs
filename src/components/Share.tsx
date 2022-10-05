import React from "react";
import { StyleSheet, Platform } from "react-native";
import { Button } from "react-native-elements";
import { Share as NativeShare } from 'react-native';

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
    hasTitle?: boolean,
    style?: {},
    shareText: string
};

const Share = ({ shareText, style, hasTitle }: ShareProps) => {
    return <Button 
        icon={{ name: Platform.OS === 'ios' ? "share-apple" : "share-google", size: 30, type: 'evilicon', color: "white" }}
        title={hasTitle ? "Share" : ""}
        onPress={() => {
            let shareString = shareText;
            share(shareString);
        }}
        buttonStyle={{ ...styles.copyIcon, ...style }}
    />;
};

const styles = StyleSheet.create({
    copyIcon: {
    }
});

export default Share;