import React, { useReducer } from 'react';

export type Action = {
    type: string,
    payload: any
};

type BoundActionFunction = (...args: any[]) => void;
type ActionFunction = (dispatch: React.Dispatch<Action>) => BoundActionFunction;
type Actions = Record<string, ActionFunction>;
type BoundActions = Record<string, BoundActionFunction>;

type ChildrenContainer = {
    children: JSX.Element
};

type CreateDataContextReturnType<Type> = {
    Context: React.Context<DataContext<Type>>,
    Provider: (childrenContainer: ChildrenContainer) => JSX.Element
}

type DataContext<Type> = {
    state: Type,
    actions: BoundActions
};

function createDataContext<Type>(reducer: React.Reducer<Type, Action>, actions: Actions, defaultValue: Type): CreateDataContextReturnType<Type> {
    let startingState: { state: Type, actions: BoundActions } = { state: defaultValue, actions: {}};
    const Context = React.createContext(startingState);

    const Provider = ({ children }: ChildrenContainer) => {
        const [state, dispatch]: [Type, React.Dispatch<Action>] = useReducer<React.Reducer<Type, Action>>(reducer, defaultValue);

        const boundActions: BoundActions = {};
        for (let key in actions) {
            boundActions[key] = actions[key](dispatch);
        }

        return (
            <Context.Provider value={{ state, actions: boundActions }}>
                {children}
            </Context.Provider>
        );
    }

    return { Context, Provider };
};

export default createDataContext;