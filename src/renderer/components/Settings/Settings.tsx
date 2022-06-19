import {
  Alert,
  Button,
  Collapse,
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
import DropdownInput, { leagueItems } from './DropdownInput';
import HotkeyInput from './HotkeyInput';
import HotkeyActionTypes from '../../../main/Hotkey/HotkeyActionTypes';

interface SettingsProps {
  toggleSettings: () => void;
  repeatSetup: () => void;
}

export default function Settings({
  toggleSettings,
  repeatSetup,
}: SettingsProps) {
  const { store } = useStore();
  const [alert, setAlert] = useState({ state: false, text: '' });
  const [settings, setSettings] = useState<StoreSchema['settings']>(
    store.state.settings
  );

  MainProcess.onEvent('MAIN->OVERLAY::hotkeyError', (payload) => {
    setAlert({ state: true, text: payload.text });
    setTimeout(() => setAlert({ state: false, text: payload.text }), 3000);
  });

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
      <Grid container rowSpacing={4} columnSpacing={0.5}>
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
        <Grid item md={6} sx={{ paddingRight: 2 }}>
          <DropdownInput
            label="Select your current League"
            dropdownItems={leagueItems}
            updateSettings={updateSettings}
            currentSettings={settings}
            setting="selectedLeague"
          />
        </Grid>
        <Grid item md={6}>
          <HotkeyInput
            label="Trade Assistant"
            updateSettings={updateSettings}
            currentSettings={settings}
            hotkeyActionType={HotkeyActionTypes.ToggleCbOberserver}
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
      <div className={classNames(classes.notificationWrapper)}>
        <Collapse in={alert.state}>
          <Alert severity="error">{alert.text}</Alert>
        </Collapse>
      </div>
    </div>
  );
}
