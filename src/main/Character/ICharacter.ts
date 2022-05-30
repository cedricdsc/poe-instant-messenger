import { Message } from 'main/Message/Message';

export interface ICharacter {
  username: string;
  unread: number;
  messages: Message[];
}
