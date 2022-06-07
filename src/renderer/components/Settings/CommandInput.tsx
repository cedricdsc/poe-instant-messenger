import { FormControl, Input, InputLabel } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import MainProcess from '../../background/mainProcess';
import { useStore } from '../../background/store';
import Command from '../../../main/Command/Command';

interface CommandInputProps {
  command: Command.PartyInvite | Command.PartyKick;
  name: string;
}

export default function CommandInput({ command, name }: CommandInputProps) {
  const { store } = useStore();
  const [text, setText] = useState(
    store.state.settings.commandMessages[command]
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    MainProcess.sendEvent({
      name: 'OVERLAY->MAIN::changeCommandMessage',
      payload: {
        command,
        text: event.target.value,
      },
    });
  };

  return (
    <FormControl variant="standard">
      <InputLabel htmlFor="component-simple">{name}</InputLabel>
      <Input
        id={command.substring(1, command.length - 1)}
        value={text}
        onChange={handleChange}
      />
    </FormControl>
  );
}
