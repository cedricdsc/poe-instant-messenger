import HotkeyActionTypes from '../../main/Hotkey/HotkeyActionTypes';
import Command from '../../main/Command/Command';
import { StoreSchema } from '../../main/Store/schema';
import Hotkey from '../../main/Hotkey/Hotkey';

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
    selectedLeague: 'Sentinel',
    commandMessages: {
      [Command.PartyInvite]:
        'Your item is ready to be picked-up Exile. I sent you a party invite!',
      [Command.PartyKick]: 'Thank you for the trade, Exile.',
    },
    hotkeys: {
      [HotkeyActionTypes.ToggleCbOberserver]: new Hotkey({
        altKey: true,
        ctrlKey: false,
        shiftKey: false,
        keycode: 33,
        metaKey: false,
        type: 5,
      }),
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
