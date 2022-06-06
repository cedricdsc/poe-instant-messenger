import Message from '../Message/Message';
import { TradeStatus } from './CharacterStatus';

export interface ICharacter {
  username: string;
  unread: number;
  messages: Message[];
  tradeStatus: TradeStatus;
}
