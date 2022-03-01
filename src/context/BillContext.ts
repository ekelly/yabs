import React from "react";
import createDataContext, { Action } from "./createDataContext";
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid';

// Types

export type Person = {
    name: string, // Human readable, for keeping track of who is who
    share: string, // The proportion of the bill which is due to this person
    id: string // For internal tracking purposes
};

export type BillState = {
    description: string,
    total: string, // The total cost of the bill, including tax & tip
    people: Array<Person> // The people involved in the bill splitting
};

export type PersonContribution = {
    id: string // For internal tracking purposes
    name: string, // Human readable, for keeping track of who is who
    personTotal: number, // The amount of $$ that this person must contribute to the bill
}

type TotalContributionsList = Array<PersonContribution>;

// Reducer

const BillReducer = (state: BillState, action: Action): BillState => {
    switch (action.type) {
        case 'add_person': {
            let person = createPerson(action.payload.name);
            return { ...state, people: [ ...state.people, person ] };
        }
        case 'update_person_name': {
            let updatedPeople = updatePerson(state, action.payload.id, 
                (p) => { return { ...p, name: action.payload.name }});
            return { ...state, people: updatedPeople };
        }
        case 'update_share': {
            return { ...state, people: updatePerson(state, action.payload.id, 
                (p) => { return { ...p, share: action.payload.share }})};
        }
        case 'update_total':
            return { ...state, total: action.payload.total };
        case 'update_description':
            return { ...state, description: action.payload.description };
        default:
            return state;
    }
};

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
    return (total: string) => {
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
        let share = parseFloat(person.share);
        return isNaN(share) ? 0 : share;
    }
    return 0;
}

function getTotal(state: BillState): number { 
    return parseFloat(state.total);
};

function calculateTotals(state: BillState): TotalContributionsList {
    let peopleList = selectPeopleList(state);
    let totalShares = peopleList.map<number>(getShare).reduce((p, c) => p + c, 0);
    
    if (totalShares == 0) {
        return [];
    }
    
    let contributionList: TotalContributionsList = [];

    peopleList.forEach((value) => {
        let personContribution = { id: value.id, name: value.name, personTotal: 0 };
        personContribution.personTotal = parseFloat((getTotal(state) * (getShare(value) / totalShares)).toFixed(2));
        contributionList.push(personContribution);
    });

    return contributionList;
}

function createPerson(name: string): Person {
    return {
        name,
        share: "1",
        id: uuidv4()
    };
};

function createInitialState(): BillState {
    let person1 = createPerson("Person 1");
    let person2 = createPerson("Person 2");
    let people = [ person1, person2 ];
    return { description: "", total: "", people: people };
}

// Exports

const Actions = {
    addPerson, updateShare, updateTotal, updatePersonName, updateDescription
};

export const { Context, Provider } = createDataContext<BillState>(BillReducer, Actions, createInitialState());