import { Direction } from '../Message/Direction';

export interface IMessage {
  direction: Direction;
  timestamp: Date;
  text: string;
  username: string;
}
