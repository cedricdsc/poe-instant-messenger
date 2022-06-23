import { Schema } from 'electron-store';
import Command from '../Command/Command';
import Character from '../Character/Character';
import Direction from '../Message/Direction';
import HotkeyActionTypes from '../Hotkey/HotkeyActionTypes';
import IHotkey from '../Hotkey/IHotkey';

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

export function instaceOfSettings(
  object: any
): object is StoreSchema['settings'] {
  return (
    'setUp' in object &&
    'darkTheme' in object &&
    'logPath' in object &&
    'windowTitle' in object &&
    'hardwareAccelerationEnabled' in object &&
    'windowPosX' in object &&
    'windowPosY' in object &&
    'selectedLeague' in object &&
    'commandMessages' in object &&
    'hotkeys' in object
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
              timestamp: { format: 'date-time' },
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
