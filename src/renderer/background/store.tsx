import React, { useCallback, useContext } from 'react';
import {
  storeReducer,
  StoreState,
  Actions,
  ActionsMap,
  Store,
  initialState,
} from './reducer';

export type Dispatcher = <
  Type extends Actions['type'],
  Payload extends ActionsMap[Type]
>(
  type: Type,
  ...payload: Payload extends undefined ? [undefined?] : [Payload]
) => void;

type StoreContextInterface = readonly [StoreState, Dispatcher];

const startingStore: Store = {
  state: initialState,
  dispatch: () => {},
};

export const StoreContext = React.createContext<StoreContextInterface>([
  { store: startingStore },
  () => {},
]);

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, doDispatch] = React.useReducer(storeReducer, {
    store: startingStore,
  });

  const dispatch: Dispatcher = useCallback((type, ...payload) => {
    doDispatch({ type, payload: payload[0] } as Actions);
  }, []);

  return (
    <StoreContext.Provider value={[state, dispatch]}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const [{ store }, dispatch] = useContext(StoreContext);

  const setStore = useCallback(
    (newStore: Store) => dispatch('setStore', newStore),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return {
    store,
    setStore,
  };
}
