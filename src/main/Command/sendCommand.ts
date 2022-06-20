import { clipboard } from 'electron';
import sendMessage from '../Message/sendMessage';
import { ICommand } from './ICommand';
import Command from './Command';

export default async function sendCommand(payload: ICommand) {
  if (payload.username) {
    if (
      payload.command === Command.PartyKick ||
      payload.command === Command.PartyInvite
    ) {
      if (payload.message) {
        clipboard.writeText(`@${payload.username} ${payload.message}`);

        await sendMessage(0);
      }
    }

    clipboard.writeText(`${payload.command} ${payload.username}`);
  } else {
    clipboard.writeText(`${payload.command}`);
  }

  await sendMessage(0);
}
