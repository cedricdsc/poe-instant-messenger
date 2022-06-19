import { Grid } from '@mui/material';
import { StoreSchema } from '../../../main/Store/schema';
import CommandInput from './CommandInput';
import Command from '../../../main/Command/Command';

interface CommandSettingsProps {
  currentSettings: StoreSchema['settings'];
  updateSettings: (arg0: StoreSchema['settings']) => void;
}

export default function CommandSettings({
  currentSettings,
  updateSettings,
}: CommandSettingsProps) {
  return (
    <Grid container rowSpacing={4} columnSpacing={0.5}>
      <Grid item md={6} sx={{ paddingRight: 2 }}>
        <CommandInput
          command={Command.PartyInvite}
          name="Party Invite Message"
          updateSettings={updateSettings}
          currentSettings={currentSettings}
          helperText="Tell the Player you are ready to trade."
        />
      </Grid>
      <Grid item md={6}>
        <CommandInput
          command={Command.PartyKick}
          name="Thank for Trade Message"
          updateSettings={updateSettings}
          currentSettings={currentSettings}
          helperText="Thank the Player for the trade."
        />
      </Grid>
    </Grid>
  );
}
