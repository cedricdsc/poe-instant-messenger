import {
  Button,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import classNames from 'classnames';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useState } from 'react';
import WifiProtectedSetupIcon from '@mui/icons-material/WifiProtectedSetup';
import SaveIcon from '@mui/icons-material/Save';
import classes from './Settings.module.scss';
import CommandInput from './CommandInput';
import Command from '../../../main/Command/Command';
import { useStore } from '../../background/store';
import { StoreSchema } from '../../../main/Store/schema';
import MainProcess from '../../background/mainProcess';
import { getTheme } from '../../background/util';

interface SettingsProps {
  toggleSettings: () => void;
  repeatSetup: () => void;
}

export default function Settings({
  toggleSettings,
  repeatSetup,
}: SettingsProps) {
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
    <div
      className={classNames(classes.settingsWrapper)}
      style={{ backgroundColor: getTheme(store).palette.background.default }}
    >
      <Grid container rowSpacing={1} columnSpacing={0.5}>
        <Grid item md={12}>
          <Tooltip title="Go back to Messenger">
            <IconButton sx={{ marginLeft: -1 }} onClick={toggleSettings}>
              <KeyboardBackspaceIcon />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item md={12}>
          <Typography
            variant="h5"
            sx={{ color: getTheme(store).palette.text.primary }}
          >
            Settings
          </Typography>
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
          <div className={classNames(classes.buttonsWrapper)}>
            <Tooltip title="Repeat the Setup Dialog">
              <Button
                variant="contained"
                startIcon={<WifiProtectedSetupIcon />}
                onClick={repeatSetup}
              >
                Re-run Setup
              </Button>
            </Tooltip>
            <Tooltip title="Save Settings">
              <Button
                variant="contained"
                endIcon={<SaveIcon />}
                onClick={saveSettings}
              >
                Save
              </Button>
            </Tooltip>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
