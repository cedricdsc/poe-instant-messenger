import Direction from './Direction';

export interface IMessage {
  direction: Direction;
  timestamp: string;
  text: string;
  username: string;
}
