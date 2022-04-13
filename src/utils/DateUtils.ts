

export function timestampToDate(timestamp: string): Date {
    return new Date(Date.parse(timestamp.replace(" ", "T")));
}