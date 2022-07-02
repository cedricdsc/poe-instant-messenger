import { Schema } from 'electron-store';
import Command, { isCommand } from '../Command/Command';
import Character from '../Character/Character';
import Direction from '../Message/Direction';
import HotkeyActionTypes, {
  isHotkeyActionType,
} from '../Hotkey/HotkeyActionTypes';
import IHotkey, { instanceOfHotkey } from '../Hotkey/IHotkey';

export interface StoreSchema {
  settings: {
    setUp: boolean;
    darkTheme: boolean;
    logPath: string;
    windowTitle: string;
    hardwareAccelerationEnabled: boolean;
    windowPosX: number;
    windowPosY: number;
    selectedLeague: string;
    commandMessages: Record<Command.PartyInvite | Command.PartyKick, string>;
    hotkeys: Record<HotkeyActionTypes, IHotkey>;
  };
  messageStore: Array<Character>;
}

export function instanceOfSettings(
  object: any
): object is StoreSchema['settings'] {
  return (
    'setUp' in object &&
    typeof object.setUp === 'boolean' &&
    'darkTheme' in object &&
    typeof object.darkTheme === 'boolean' &&
    'logPath' in object &&
    typeof object.logPath === 'string' &&
    'windowTitle' in object &&
    typeof object.windowTitle === 'string' &&
    'hardwareAccelerationEnabled' in object &&
    typeof object.hardwareAccelerationEnabled === 'boolean' &&
    'windowPosX' in object &&
    typeof object.windowPosX === 'number' &&
    'windowPosY' in object &&
    typeof object.windowPosY === 'number' &&
    'selectedLeague' in object &&
    typeof object.selectedLeague === 'string' &&
    'commandMessages' in object &&
    Object.keys(object.commandMessages).every((command) =>
      isCommand(command)
    ) &&
    'hotkeys' in object &&
    Object.keys(object.hotkeys).every((hotkeyActionType) => {
      if (isHotkeyActionType(hotkeyActionType)) {
        return instanceOfHotkey(object.hotkeys[hotkeyActionType]);
      }
      return false;
    })
  );
}

const schema: Schema<StoreSchema> = {
  settings: {
    type: 'object',
    properties: {
      setUp: {
        type: 'boolean',
      },
      darkTheme: {
        type: 'boolean',
      },
      logPath: {
        type: 'string',
      },
      windowTitle: {
        type: 'string',
      },
      hardwareAccelerationEnabled: {
        type: 'boolean',
      },
      windowPosX: {
        type: 'number',
      },
      windowPosY: {
        type: 'number',
      },
      selectedLeague: {
        type: 'string',
      },
      commandMessages: {
        type: 'object',
        properties: {
          [Command.PartyInvite]: {
            type: 'string',
          },
          [Command.PartyKick]: {
            type: 'string',
          },
        },
      },
      hotkeys: {
        type: 'object',
        properties: {
          [HotkeyActionTypes.ToggleCbOberserver]: {
            type: 'object',
            properties: {
              ctrlKey: { type: 'boolean' },
              altKey: { type: 'boolean' },
              shiftKey: { type: 'boolean' },
              keycode: { type: 'number' },
              keyName: { type: 'string' },
            },
          },
          [HotkeyActionTypes.JoinOwnHideout]: {
            type: 'object',
            properties: {
              keycode: { type: 'number' },
              ctrlKey: { type: 'boolean' },
              altKey: { type: 'boolean' },
              shiftKey: { type: 'boolean' },
              keyName: { type: 'string' },
            },
          },
        },
      },
    },
  },
  messageStore: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        unread: { type: 'number' },
        messages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              direction: { enum: [Direction.Incoming, Direction.Outgoing] },
              timestamp: { format: 'date-time', type: 'string' },
              text: { type: 'string' },
              username: { type: 'string' },
            },
          },
        },
      },
    },
  },
};

export default schema;
