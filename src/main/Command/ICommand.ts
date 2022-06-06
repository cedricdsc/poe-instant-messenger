import Command from './Command';

export interface ICommand {
  command: Command;
  username?: string;
  message?: string;
}
