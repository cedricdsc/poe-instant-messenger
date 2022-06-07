import { Divider, Grid, IconButton, Typography } from '@mui/material';
import classNames from 'classnames';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import classes from './Settings.module.scss';
import CommandInput from './CommandInput';
import Command from '../../../main/Command/Command';

interface SettingsProps {
  toggleSettings: () => void;
}

export default function Settings({ toggleSettings }: SettingsProps) {
  return (
    <div className={classNames(classes.settingsWrapper)}>
      <Grid container rowSpacing={1} columnSpacing={0.5}>
        <Grid item md={12}>
          <IconButton sx={{ marginLeft: -1 }} onClick={toggleSettings}>
            <KeyboardBackspaceIcon />
          </IconButton>
        </Grid>
        <Grid item md={12}>
          <Typography variant="h5">Settings</Typography>
          <Divider sx={{ marginBottom: 2 }} />
        </Grid>
        <Grid item md={6}>
          <CommandInput
            command={Command.PartyInvite}
            name="Party Invite Message"
          />
        </Grid>
        <Grid item md={6}>
          <CommandInput
            command={Command.PartyKick}
            name="Thank for Trade Message"
          />
        </Grid>
      </Grid>
    </div>
  );
}
