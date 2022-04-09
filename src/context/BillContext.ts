import React from "react";
import createDataContext, { Action } from "./createDataContext";
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid';

// Types

export type Person = {
    name: string, // Human readable, for keeping track of who is who
    share: number, // The proportion of the bill which is due to this person, "in pennies"
    id: string // For internal tracking purposes
    transactions: Array<TransactionId>
};

export type BillState = {
    description: string,
    total: number, // The total cost of the bill, including tax & tip in pennies
    people: Array<Person> // The people involved in the bill splitting
    transactions: Array<Transaction> // The list of transactions
};

export type PersonContribution = {
    id: string, // For internal tracking purposes
    name: string, // Human readable, for keeping track of who is who
    personTotal: number, // The amount of $$ that this person must contribute to the bill
}

export type Transaction = {
    id: TransactionId, // Identifier for the transaction
    adjustments: Array<Adjustment>
}

export type Adjustment = {
    id: string, // Identifier of the person being adjusted
    adjustAmount: number // Number "in pennies" being adjusted
}

export type TransactionId = string;

type TotalContributionsList = Array<PersonContribution>;

// Reducer

const BillReducer = (state: BillState, action: Action): BillState => {
    switch (action.type) {
        case 'add_person': 
            return internalAddPerson(state, action.payload.name);
        case 'delete_person': 
            return internalDeletePerson(state, action.payload.id);
        case 'update_person_name': 
            return internalUpdatePersonName(state, action.payload.id, action.payload.name);
        case 'update_share': 
            return internalUpdateShare(state, action.payload.id, action.payload.share);
        case 'add_shares':
            return internalAddShares(state, action.payload.ids, action.payload.share);
        case 'update_total':
            return internalUpdateTotal(state, action.payload.total);
        case 'update_description':
            return internalUpdateDescription(state, action.payload.description);
        default:
            return state;
    }
};

function internalAddPerson(state: BillState, name: string): BillState {
    let person = createPerson(name);
    return { ...state, people: [ ...state.people, person ] };
}

function internalDeletePerson(state: BillState, id: string): BillState {
    return { ...state, people: [ ...state.people ].filter(value => id !== value.id) };
}

function internalUpdatePersonName(state: BillState, id: string, name: string): BillState {
    let updatedPeople = updatePerson(state, id, (p) => { return { ...p, name: name }});
    return { ...state, people: updatedPeople };
}

function internalUpdateShare(state: BillState, id: string, share: number): BillState {
    let transaction: Transaction = { id: "t-" + uuidv4(), adjustments: [
        { id, adjustAmount: share }
    ]};
    return { 
        ...state, 
        transactions: [ ...state.transactions, transaction ],
        people: updatePerson(state, id, (p) => { 
            return { ...p, share, transactions: [ ...p.transactions, transaction.id ] };
        })
    };
}

function internalAddShares(state: BillState, ids: Set<string>, share: number): BillState {
    let adjustments: Adjustment[] = Array.from(ids).map<Adjustment>(id => {
        return { id, adjustAmount: share };
    });
    let transaction: Transaction = { id: "t-" + uuidv4(), adjustments };
    let people: Person[] = Array.from(state.people).map(person => {
        if (ids.has(person.id)) {
            return { ...person, transactions: [...person.transactions, transaction.id ]}
        } else {
            return person;
        }
    });
    return {
        ...state, 
        transactions: [ ...state.transactions, transaction ],
        people
    };
}

function internalUpdateTotal(state: BillState, total: number): BillState {
    return { ...state, total };
}

function internalUpdateDescription(state: BillState, description: string): BillState {
    return { ...state, description };
}

// Actions

function addPerson(dispatch: React.Dispatch<Action>) {
    return (name: string) => {
        dispatch({ type: 'add_person', payload: { name }});
    };
};

function updatePersonName(dispatch: React.Dispatch<Action>) {
    return (id: string, name: string) => {
        dispatch({ type: 'update_person_name', payload: { id, name }});
    };
}

function updateTotal(dispatch: React.Dispatch<Action>) {
    return (total: number) => {
        dispatch({ type: 'update_total', payload: { total }});
    };
};

function updateDescription(dispatch: React.Dispatch<Action>) {
    return (description: string) => {
        dispatch({ type: 'update_description', payload: { description }});
    };
};

function updateShare(dispatch: React.Dispatch<Action>) {
    return (id: string, share: string) => {
        dispatch({ type: 'update_share', payload: { id, share } });
    };
};

function addShares(dispatch: React.Dispatch<Action>) {
    return (share: number, ids: Set<string>) => {
        dispatch({ type: 'add_shares', payload: { ids, share } });
    };
};

function deletePerson(dispatch: React.Dispatch<Action>) {
    return (id: string) => {
        dispatch({ type: 'delete_person', payload: { id } });
    };
};

// Selectors

export const selectContributionPerPerson = calculateTotals;

export const selectPeopleList = (state: BillState) => Object.entries(state.people).map(it => it[1]);

export const selectPerson = (state: BillState, id: string) => state.people.find(person => person.id === id);

// Helper functions

function updatePerson(state: BillState, id: string, updateFunc: (p: Person) => Person): Array<Person> {
    let person = selectPerson(state, id);
    if (person) {
        return [ ...state.people.map<Person>(p => p.id === id ? updateFunc({ ...p }) : p) ];
    }
    return state.people;
}

function getShare(person: Person): number {
    if (person.share) {
        return person.share;
    }
    return 0;
}

function getTotalInDollars(state: BillState): number { 
    return state.total / 100;
};

function calculateTotals(state: BillState): TotalContributionsList {
    let peopleList = selectPeopleList(state);
    let totalShares = peopleList.map<number>(getShare).reduce((p, c) => p + c, 0);
    
    if (totalShares == 0) {
        return [];
    }
    
    let contributionList: TotalContributionsList = [];

    peopleList.forEach((person) => {
        let personContribution = { id: person.id, name: person.name, personTotal: 0 };
        personContribution.personTotal = parseFloat((getTotalInDollars(state) * (getShare(person) / totalShares)).toFixed(2));
        contributionList.push(personContribution);
    });

    return contributionList;
}

function createPerson(name: string): Person {
    return {
        name,
        share: 0,
        id: uuidv4(),
        transactions: []
    };
};

function createInitialState(): BillState {
    let person1 = createPerson("Person 1");
    let person2 = createPerson("Person 2");
    let people = [ person1, person2 ];
    return { description: "", total: 0, people: people, transactions: [] };
}

// Exports

export function getDisplayableTotal(total: number): string {
    return (total / 100).toFixed(2);
}

const Actions = {
    addPerson, updateShare, updateTotal, updatePersonName, updateDescription, deletePerson, addShares,
};

export const { Context, Provider } = createDataContext<BillState>(BillReducer, Actions, createInitialState());