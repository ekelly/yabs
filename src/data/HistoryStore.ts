import { BillState } from "../context/BillContext";
import { Person } from "../context/BillContext";

export interface HistoryItem {
    id: string,
    description: string,
    total: number,
    timestamp: string,
    people: Person[]
}

export interface HistoryStore {
    saveState: (state: BillState) => Promise<void>,
    fetchHistory: () => Promise<Array<HistoryItem>>,
    deleteItem: (id: string) => Promise<void>,
    deleteAll: () => Promise<void>,
    deletePersonFromBill: (personId: string, billId: string) => Promise<void>
}