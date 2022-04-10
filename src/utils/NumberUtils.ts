
export function textToNumber(text: string): number | null {
    let float = parseFloat(text);
    if (isNaN(float)) {
        return null;
    } else {
        return Math.round(float * 100);
    }
}

const re = /^[0-9]*\.?[0-9]{0,2}$/;

export function isNumeric(text: string): boolean {
    return re.test(text);
}