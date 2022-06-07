import { Button, Divider, Grid, IconButton, Typography } from '@mui/material';
import classNames from 'classnames';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import classes from './Settings.module.scss';
import CommandInput from './CommandInput';
import Command from '../../../main/Command/Command';
import { useStore } from '../../background/store';
import { StoreSchema } from '../../../main/Store/schema';
import MainProcess from '../../background/mainProcess';

interface SettingsProps {
  toggleSettings: () => void;
}

export default function Settings({ toggleSettings }: SettingsProps) {
  const { store } = useStore();
  const [settings, setSettings] = useState<StoreSchema['settings']>(
    store.state.settings
  );

  const updateSettings = (newSettings: StoreSchema['settings']) => {
    setSettings(newSettings);
  };

  const saveSettings = () => {
    MainProcess.sendEvent({
      name: 'OVERLAY->MAIN::saveSettings',
      payload: { settings },
    });
    toggleSettings();
  };

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
        <Grid item md={6} sx={{ paddingRight: 2 }}>
          <CommandInput
            command={Command.PartyInvite}
            name="Party Invite Message"
            updateSettings={updateSettings}
            currentSettings={settings}
            helperText="Tell the Player you are ready to trade."
          />
        </Grid>
        <Grid item md={6}>
          <CommandInput
            command={Command.PartyKick}
            name="Thank for Trade Message"
            updateSettings={updateSettings}
            currentSettings={settings}
            helperText="Thank the Player for the trade."
          />
        </Grid>
        <Grid item md={12}>
          <div className={classNames(classes.saveButtonWrapper)}>
            <Button
              variant="contained"
              endIcon={<SaveIcon />}
              onClick={saveSettings}
            >
              Save
            </Button>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
