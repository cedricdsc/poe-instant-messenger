import { Schema } from 'electron-store';
import Command from '../Command/Command';
import Character from '../Character/Character';
import Direction from '../Message/Direction';

export interface StoreSchema {
  settings: {
    setUp: boolean;
    logPath: string;
    windowTitle: string;
    hardwareAccelerationEnabled: boolean;
    windowPosX: number;
    windowPosY: number;
    commandMessages: Record<Command.PartyInvite | Command.PartyKick, string>;
  };
  messageStore: Array<Character>;
}

export function instaceOfSettings(
  object: any
): object is StoreSchema['settings'] {
  return (
    'setUp' in object &&
    'logPath' in object &&
    'windowTitle' in object &&
    'hardwareAccelerationEnabled' in object &&
    'windowPosX' in object &&
    'windowPosY' in object &&
    'commandMessages' in object
  );
}

const schema: Schema<StoreSchema> = {
  settings: {
    type: 'object',
    properties: {
      setUp: {
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
