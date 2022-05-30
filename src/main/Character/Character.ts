import Message from 'main/Message/Message';
import { ICharacter } from './ICharacter';

class Character implements ICharacter {
  username: string;

  unread: number;

  messages: Message[];

  constructor(username: string) {
    this.messages = [];
    this.unread = 0;
    this.username = username;
  }
}

export default Character;
