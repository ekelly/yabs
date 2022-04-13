import { HistoryItem, HistoryStore } from "./HistoryStore";
import * as SQLite from "expo-sqlite";
import { BillState, selectContributionPerPerson, Person } from "../context/BillContext";

// SQL

const TABLE_BILLS = "bills";
const TABLE_PEOPLE = "people";

// Bills table
const COLUMN_ID = "id";
const COLUMN_TOTAL = "total";
const COLUMN_DESCRIPTION = "description";
const COLUMN_TIMESTAMP = "timestamp";

// People table
const COLUMN_PERSON_ID = "person_id";
const COLUMN_BILL_ID = "bill_id";
const COLUMN_PERSON_NAME = "person_name";
const COLUMN_CONTRIBUTION = "contribution"; // The total (in dollars) that they are contributing

const SQL_CREATE_TABLE_BILLS = `CREATE TABLE IF NOT EXISTS ${TABLE_BILLS} (${COLUMN_ID} TEXT PRIMARY KEY NOT NULL, ${COLUMN_TOTAL} REAL NOT NULL, ${COLUMN_DESCRIPTION} TEXT NOT NULL, ${COLUMN_TIMESTAMP} DATETIME DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')))`;
const SQL_CREATE_TABLE_PEOPLE = `CREATE TABLE IF NOT EXISTS ${TABLE_PEOPLE} (${COLUMN_BILL_ID} TEXT NOT NULL, ${COLUMN_PERSON_ID} TEXT NOT NULL, ${COLUMN_PERSON_NAME} TEXT NOT NULL, ${COLUMN_CONTRIBUTION} REAL NOT NULL, PRIMARY KEY(${COLUMN_BILL_ID},${COLUMN_PERSON_ID}))`;
const SQL_INSERT_BILL = `INSERT OR REPLACE INTO ${TABLE_BILLS}(${COLUMN_ID}, ${COLUMN_TOTAL}, ${COLUMN_DESCRIPTION}) VALUES(?, ?, ?)`;
const SQL_INSERT_PERSON = `INSERT OR REPLACE INTO ${TABLE_PEOPLE}(${COLUMN_PERSON_ID}, ${COLUMN_BILL_ID}, ${COLUMN_PERSON_NAME}, ${COLUMN_CONTRIBUTION}) VALUES(?, ?, ?, ?)`;
const SQL_FETCH_BILLS = `SELECT * FROM ${TABLE_BILLS}`;
const SQL_FETCH_PEOPLE = `SELECT * FROM ${TABLE_PEOPLE}`;
const SQL_DELETE_BILL = `DELETE FROM ${TABLE_BILLS} WHERE ${COLUMN_BILL_ID} = ?`;
const SQL_DELETE_PEOPLE_BY_BILL_ID = `DELETE FROM ${TABLE_PEOPLE} WHERE ${COLUMN_BILL_ID} = ?`;

interface BillRow {
    [COLUMN_ID]: string, 
    [COLUMN_TOTAL]: number, 
    [COLUMN_DESCRIPTION]: string,
    [COLUMN_TIMESTAMP]: string
};

interface PersonRow {
    [COLUMN_PERSON_ID]: string,
    [COLUMN_BILL_ID]: string,
    [COLUMN_PERSON_NAME]: string,
    [COLUMN_CONTRIBUTION]: number
}

function openDatabase() {
    return SQLite.openDatabase("history.db");
}

export class SQLiteHistoryStore implements HistoryStore {
    #db = openDatabase();

    constructor() {
        this.#db.transaction(transaction => {
            transaction.executeSql(SQL_CREATE_TABLE_BILLS, [], () => {  
            }, (tx, error) => {
                console.log(`Error creating bill table due to ${error.message}`);
                return true;
            });
            transaction.executeSql(SQL_CREATE_TABLE_PEOPLE, [], () => {  
            }, (tx, error) => {
                console.log(`Error creating peple table due to ${error.message}`);
                return true;
            });
        }, (error) => {
            console.log(error.message);
        }, () => {
            console.log("Successfully ensured tables were created");
        });
    }

    async saveState(state: BillState): Promise<void> {
        let db = this.#db;
        return new Promise<void>((resolve, reject) => {
            db.transaction((transaction) => {
                // Execute SQL to insert bill
                let { id, total, description } = state;
                transaction.executeSql(SQL_INSERT_BILL, [id, total, description], (tx, results) => {
                    console.log(`Inserted bill ${id}: ${[total, description].toString()}`);
                }, (tx, error) => {
                    console.log(`Failed to insert bill ${id} due to ${error.message}`);
                    reject(error.message);
                    return true;
                });

                // Execute SQL to insert people
                let totalContributionsList = selectContributionPerPerson(state);
                totalContributionsList.forEach(contribution => {
                    let { name, personTotal } = contribution;
                    let personId = contribution.id;
                    transaction.executeSql(SQL_INSERT_PERSON, [personId, id, name, personTotal], (tx, results) => {
                        console.log(`Inserted person ${personId}: ${[id, name, personTotal].toString()}`);
                    }, (tx, error) => {
                        console.log(`Failed to insert person ${personId} due to ${error.message}`);
                        reject(error.message);
                        return true;
                    });
                });
            }, (error) => {
                reject(error.message);
            }, () => {
                resolve();
            });
        });
    }

    async fetchHistory() {
        let db = this.#db;
        return new Promise<Array<HistoryItem>>((resolve, reject) => {
            let historyItems: Array<HistoryItem> = [];
            db.transaction((transaction) => {
                transaction.executeSql(SQL_FETCH_BILLS, [], (tx, results) => {
                    let bills = results;
                    transaction.executeSql(SQL_FETCH_PEOPLE, [], (tx, results) => {
                        let people = results;

                        let peopleMap: Map<string, Array<PersonRow>> = new Map();
                        for (let j = 0; j < people.rows.length; j++) {
                            let personRow: PersonRow = people.rows.item(j);
                            let { bill_id } = personRow;
                            if (!peopleMap.has(bill_id)) {
                                peopleMap.set(bill_id, []);
                            }
                            peopleMap.get(bill_id)?.push(personRow);
                        }

                        for (let i = 0; i < bills.rows.length; i++) {
                            let { id, description, timestamp, total }: BillRow = bills.rows.item(i);
                            let people: Person[] | undefined;
                            if (peopleMap.has(id)) {
                                people = peopleMap.get(id)?.map<Person>((personRow) => {
                                    return {
                                        id: personRow[COLUMN_PERSON_ID],
                                        name: personRow[COLUMN_PERSON_NAME],
                                        share: personRow[COLUMN_CONTRIBUTION],
                                        transactions: []
                                    };
                                });
                            }
                            if (!people) {
                                people = [];
                            }
                            historyItems.push({
                                id, description, total, timestamp, people
                            });
                        }

                    }, (tx, error) => {
                        console.log(`Fetching people failed due to ${error.message}`);
                        reject(`Fetching people failed due to ${error.message}`);
                        return true;
                    });
                }, (tx, error) => {
                    console.log(`Fetching bills failed due to ${error.message}`);
                    reject(`Fetching bills failed due to ${error.message}`);
                    return true;
                });
            }, (error) => {
                console.log(`Fetching history failed. ${error.message}`);
                reject(`Fetching history failed due to ${error.message}`);
            }, () => {
                console.log(`Fetched history. Items: ${historyItems.length}`);
                resolve(historyItems);
            });
        });
    }
    
    async deleteItem(id: string) {
        let db = this.#db;
        return new Promise<void>((resolve, reject) => {
            db.transaction((transaction) => {
                transaction.executeSql(SQL_DELETE_BILL, [id], (tx, result) => {
                    console.log(`Deleted bill ${id} from bill table`);
                }, (tx, error) => {
                    console.log(`Error deleting ${id} from bill table due to ${error.message}`);
                    return false;
                });
                transaction.executeSql(SQL_DELETE_PEOPLE_BY_BILL_ID, [id], (tx, result) => {
                    console.log(`Deleted people associated with bill ${id} from person table`);
                }, (tx, error) => {
                    console.log(`Error deleting people associated with bill ${id} from person table due to ${error.message}`);
                    return false;
                });
            }, (error) => {
                reject(error.message);
            }, () => {
                resolve();
            });
        });
    }
}