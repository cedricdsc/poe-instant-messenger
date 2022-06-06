import Message from '../Message/Message';

export interface ICharacter {
  username: string;
  unread: number;
  messages: Message[];
}
