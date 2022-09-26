
export function penniesToOutput(priceInPennies: number): string {
    return "$" + (priceInPennies / 100).toFixed(2);
}
