import { Schema } from 'electron-store';
import { Character } from '../Character/Character';
import { Direction } from '../Message/Direction';

export interface StoreSchema {
  settings: {
    setUp: boolean;
    logPath: string;
    windowTitle: string;
    hardwareAccelerationEnabled: boolean;
    windowPosX: number;
    windowPosY: number;
  };
  messageStore: Array<Character>;
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
