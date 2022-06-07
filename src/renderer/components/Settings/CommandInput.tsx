import { FormControl, FormHelperText, Input, InputLabel } from '@mui/material';
import { ChangeEvent } from 'react';
import Command from '../../../main/Command/Command';
import { StoreSchema } from '../../../main/Store/schema';

interface CommandInputProps {
  command: Command.PartyInvite | Command.PartyKick;
  name: string;
  currentSettings: StoreSchema['settings'];
  updateSettings: (arg0: StoreSchema['settings']) => void;
  helperText?: string;
}

export default function CommandInput({
  command,
  name,
  updateSettings,
  currentSettings,
  helperText,
}: CommandInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newSettings = { ...currentSettings };
    newSettings.commandMessages[command] = event.target.value;
    updateSettings(newSettings);
  };

  return (
    <FormControl fullWidth variant="standard">
      <InputLabel htmlFor="component-simple">{name}</InputLabel>
      <Input
        id={command.substring(1)}
        value={currentSettings.commandMessages[command]}
        onChange={handleChange}
        aria-describedby={`${command.substring(1)}-helper-text`}
      />
      {helperText && (
        <FormHelperText id={`${command.substring(1)}-helper-text`}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
}
