import { TradeStatus } from '../Character/CharacterStatus';
import Command from './Command';

export interface ICommand {
  command: Command;
  username?: string;
  message?: string;
  tradeStatus?: TradeStatus;
}
