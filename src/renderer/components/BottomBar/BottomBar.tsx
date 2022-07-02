import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import HouseIcon from '@mui/icons-material/House';
import SettingsIcon from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import InfoIcon from '@mui/icons-material/Info';
import classNames from 'classnames';
import pj from '../../../../release/app/package.json';
import classes from './BottomBar.module.scss';
import MainProcess from '../../background/mainProcess';
import Command from '../../../main/Command/Command';
import { getTheme } from '../../background/util';
import { useStore } from '../../background/store';

interface BottomBarProps {
  toggleSettings: () => void;
}

export default function BottomBar({ toggleSettings }: BottomBarProps) {
  const { store } = useStore();
  const theme = getTheme(store);

  const joinOwnHideout = () => {
    MainProcess.sendEvent({
      name: 'OVERLAY->MAIN::sendCommand',
      payload: {
        command: Command.JoinHideout,
      },
    });
  };

  const toggleTheme = () => {
    MainProcess.sendEvent({
      name: 'OVERLAY->MAIN::toggleTheme',
      payload: undefined,
    });
  };

  const loadVersionInformation = () => {
    const appName = 'PoE Instant Messenger';
    const { version, author } = pj;

    return (
      <div className={classNames(classes.tooltipColumn)}>
        <div>{appName}</div>
        <div>Version: {version}</div>
        <div>Author: {author.name}</div>
      </div>
    );
  };

  return (
    <AppBar className={classNames(classes.ctaBottom)} position="static">
      <Toolbar variant="dense">
        <Tooltip title="Settings">
          <IconButton
            onClick={toggleSettings}
            sx={{ color: theme.svg.buttonColor }}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Toggle Theme">
          <IconButton
            onClick={toggleTheme}
            sx={{ color: theme.svg.buttonColor }}
          >
            {store.state.settings.darkTheme ? (
              <LightModeIcon />
            ) : (
              <DarkModeIcon />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip
          title={`Join own Hideout (${store.state.settings.hotkeys['join-own-hideout'].keyName})`}
        >
          <IconButton
            onClick={joinOwnHideout}
            sx={{ color: theme.svg.buttonColor }}
          >
            <HouseIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={loadVersionInformation()}>
          <IconButton sx={{ color: theme.svg.buttonColor }}>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
