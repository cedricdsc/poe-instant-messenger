import { Button, IconButton, Tab, Tabs, Tooltip } from '@mui/material';
import classNames from 'classnames';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { SyntheticEvent, useState } from 'react';
import WifiProtectedSetupIcon from '@mui/icons-material/WifiProtectedSetup';
import SaveIcon from '@mui/icons-material/Save';
import classes from './Settings.module.scss';
import { useStore } from '../../background/store';
import { StoreSchema } from '../../../main/Store/schema';
import MainProcess from '../../background/mainProcess';
import { getTheme } from '../../background/util';
import CommandSettings from './CommandSettings';
import HotkeySettings from './HotkeySettings';
import SettingsTab from './SettingsTab';
import GeneralSettings from './GeneralSettings';

interface SettingsProps {
  toggleSettings: () => void;
  repeatSetup: () => void;
}

export default function Settings({
  toggleSettings,
  repeatSetup,
}: SettingsProps) {
  const { store } = useStore();
  const [activeTab, setActiveTab] = useState(0);
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

  const handleChange = (_event: SyntheticEvent, newTab: number) => {
    setActiveTab(newTab);
  };

  return (
    <div
      className={classNames(classes.settingsWrapper)}
      style={{ backgroundColor: getTheme(store).palette.background.default }}
    >
      <div className={classNames(classes.tabsWrapper)}>
        <div className={classNames(classes.backBtnWrapper)}>
          <Tooltip title="Go back to Messenger">
            <IconButton sx={{ marginLeft: -1 }} onClick={toggleSettings}>
              <KeyboardBackspaceIcon />
            </IconButton>
          </Tooltip>
        </div>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          sx={{ paddingBottom: 1 }}
        >
          <Tab label="General" />
          <Tab label="Hotkeys" />
          <Tab label="Commands" />
        </Tabs>
      </div>
      <div className={classNames(classes.contentWrapper)}>
        <SettingsTab value={activeTab} index={0}>
          <GeneralSettings
            currentSettings={settings}
            updateSettings={updateSettings}
          />
        </SettingsTab>
        <SettingsTab value={activeTab} index={1}>
          <HotkeySettings
            currentSettings={settings}
            updateSettings={updateSettings}
          />
        </SettingsTab>
        <SettingsTab value={activeTab} index={2}>
          <CommandSettings
            currentSettings={settings}
            updateSettings={updateSettings}
          />
        </SettingsTab>
      </div>

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
    </div>
  );
}
