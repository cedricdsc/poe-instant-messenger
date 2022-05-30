import Direction from './Direction';

export interface IMessage {
  direction: Direction;
  timestamp: Date;
  text: string;
  username: string;
}
