import { Message } from 'main/Message/Message';
import { ICharacter } from './ICharacter';

export function instanceOfCharacter(object: any): object is Character {
  return 'messages' in object && 'unread' in object;
}

export class Character implements ICharacter {
  username: string;

  unread: number;

  messages: Message[];

  constructor(username: string) {
    this.messages = [];
    this.unread = 0;
    this.username = username;
  }
}
