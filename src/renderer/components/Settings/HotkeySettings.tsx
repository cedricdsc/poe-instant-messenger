import { useState } from 'react';
import { Alert, Collapse, Grid } from '@mui/material';
import classNames from 'classnames';
import MainProcess from '../../background/mainProcess';
import { StoreSchema } from '../../../main/Store/schema';
import HotkeyInput from './HotkeyInput';
import HotkeyActionTypes from '../../../main/Hotkey/HotkeyActionTypes';
import classes from './HotkeySettings.module.scss';

interface HotkeySettingsProps {
  currentSettings: StoreSchema['settings'];
  updateSettings: (arg0: StoreSchema['settings']) => void;
}

export default function HotkeySettings({
  currentSettings,
  updateSettings,
}: HotkeySettingsProps) {
  const [alert, setAlert] = useState({ state: false, text: '' });

  MainProcess.onEvent('MAIN->OVERLAY::hotkeyError', (payload) => {
    setAlert({ state: true, text: payload.text });
    setTimeout(() => setAlert({ state: false, text: payload.text }), 3000);
  });

  return (
    <>
      <Grid container rowSpacing={4} columnSpacing={0.5}>
        <Grid item md={6}>
          <HotkeyInput
            label="Trade Assistant"
            updateSettings={updateSettings}
            currentSettings={currentSettings}
            hotkeyActionType={HotkeyActionTypes.ToggleCbOberserver}
          />
        </Grid>
        <Grid item md={6}>
          <HotkeyInput
            label="Join own Hideout"
            updateSettings={updateSettings}
            currentSettings={currentSettings}
            hotkeyActionType={HotkeyActionTypes.JoinOwnHideout}
          />
        </Grid>
      </Grid>
      <div className={classNames(classes.notificationWrapper)}>
        <Collapse in={alert.state}>
          <Alert severity="error">{alert.text}</Alert>
        </Collapse>
      </div>
    </>
  );
}
