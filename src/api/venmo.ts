import { Linking } from "react-native";

const DEFAULT_DESCRIPTION = encodeURIComponent("Settling up with Yet Another Bill Splitter");

function getVenmoDeeplink(amount: number, description?: string): string {
    let note = !!description ? description : DEFAULT_DESCRIPTION;
    return `https://venmo.com/?txn=charge&note=${note}&amount=${amount}`;
}

const launchVenmo = async (amount: number, description?: string) => {
    let desc = description;
    if (!description) {
        desc = DEFAULT_DESCRIPTION;
    }
    let uri = getVenmoDeeplink(amount, desc);
    await Linking.openURL(uri);
};

export default launchVenmo;