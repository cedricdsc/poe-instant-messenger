import { clipboard } from 'electron';
import { sendCommandMessage } from '../Message/sendMessage';
import { ICommand } from './ICommand';
import Command from './Command';

export default async function sendCommand(
  payload: ICommand,
  hotkeyAsTrigger = false
) {
  if (payload.username) {
    if (
      payload.command === Command.PartyKick ||
      payload.command === Command.PartyInvite
    ) {
      if (payload.message) {
        clipboard.writeText(`@${payload.username} ${payload.message}`);

        await sendCommandMessage({ fromOverlay: !hotkeyAsTrigger });
      }
    }

    clipboard.writeText(`${payload.command} ${payload.username}`);
  } else {
    clipboard.writeText(`${payload.command}`);
  }

  await sendCommandMessage({ fromOverlay: !hotkeyAsTrigger });
}
