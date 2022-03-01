import * as Clipboard from 'expo-clipboard';
import { ToastAndroid } from 'react-native';

const showToast = (text: string) => {
    ToastAndroid.show(text, ToastAndroid.SHORT);
};

export const copyToClipboard = (text: string): void => {
    console.log(text);
    if (text) {
        Clipboard.setString(text);
        showToast("Copied to clipboard");
    }
};
