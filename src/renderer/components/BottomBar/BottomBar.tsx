import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import HouseIcon from '@mui/icons-material/House';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import classNames from 'classnames';
import pj from '../../../../release/app/package.json';
import classes from './BottomBar.module.scss';
import MainProcess from '../../background/mainProcess';
import Command from '../../../main/Command/Command';

interface BottomBarProps {
  toggleSettings: () => void;
}

export default function BottomBar({ toggleSettings }: BottomBarProps) {
  const joinOwnHideout = () => {
    MainProcess.sendEvent({
      name: 'OVERLAY->MAIN::sendCommand',
      payload: {
        command: Command.JoinHideout,
      },
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
          <IconButton onClick={toggleSettings}>
            <SettingsIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Join own Hideout">
          <IconButton onClick={joinOwnHideout}>
            <HouseIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={loadVersionInformation()}>
          <IconButton>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
