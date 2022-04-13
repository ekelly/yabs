import createDataContext from "./createDataContext";
import { HistoryStore } from "../data/HistoryStore";
import { SQLiteHistoryStore } from "../data/SQLiteHistoryStore";

// Types
interface HistoryState {
    store: HistoryStore
}

// Helper functions
function createInitialState() {
    return { store: new SQLiteHistoryStore() }
}

// Exports
const Actions = {
};

export const { Context, Provider } = createDataContext<HistoryState>((s, a) => s, Actions, createInitialState());