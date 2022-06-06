import Message from '../Message/Message';
import { TradeStatus } from './CharacterStatus';
import { ICharacter } from './ICharacter';

class Character implements ICharacter {
  username: string;

  unread: number;

  messages: Message[];

  tradeStatus: TradeStatus;

  constructor(username: string) {
    this.messages = [];
    this.unread = 0;
    this.username = username;
    this.tradeStatus = TradeStatus.Idle;
  }
}

export default Character;
