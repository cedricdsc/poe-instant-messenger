import Command from '../../main/Command/Command';
import { StoreSchema } from '../../main/Store/schema';

export function storeReducer(state: StoreState, action: Actions): StoreState {
  switch (action.type) {
    case 'setStore':
      return {
        ...state,
        store: action.payload,
      };
    default:
      return {
        ...state,
        store: action.payload,
      };
  }
}

export const initialState: StoreSchema = {
  settings: {
    setUp: false,
    darkTheme: false,
    logPath: '',
    windowTitle: 'Path of Exile',
    hardwareAccelerationEnabled: true,
    windowPosX: 0,
    windowPosY: 0,
    commandMessages: {
      [Command.PartyInvite]:
        'Your item is ready to be picked-up Exile. I sent you a party invite!',
      [Command.PartyKick]: 'Thank you for the trade, Exile.',
    },
  },
  messageStore: [],
};

export type Store = {
  state: StoreSchema;
  dispatch: () => void;
};

export type StoreState = {
  store: Store;
};

export type ActionsMap = {
  setStore: Store;
};

export type Actions = {
  [Key in keyof ActionsMap]: {
    type: Key;
    payload: ActionsMap[Key];
  };
}[keyof ActionsMap];
