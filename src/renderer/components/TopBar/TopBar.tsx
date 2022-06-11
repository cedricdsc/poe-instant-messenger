import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import HelpIcon from '@mui/icons-material/Help';
import classNames from 'classnames';
import MainProcess from '../../background/mainProcess';
import { useStore } from '../../background/store';
import classes from './TopBar.module.scss';
import Command from '../../../main/Command/Command';
import { getTheme } from '../../background/util';

interface TopBarProps {
  currentUserIndex: number;
  toggleMessenger: () => void;
  deleteChatHistory: () => void;
}

export default function TopBar({
  currentUserIndex,
  toggleMessenger,
  deleteChatHistory,
}: TopBarProps) {
  const { store } = useStore();
  const theme = getTheme(store);

  const tradePlayer = () => {
    MainProcess.sendEvent({
      name: 'OVERLAY->MAIN::sendCommand',
      payload: {
        command: Command.TradeInvite,
        username: store.state.messageStore[currentUserIndex].username,
      },
    });
  };

  const thankPlayer = () => {
    MainProcess.sendEvent({
      name: 'OVERLAY->MAIN::sendCommand',
      payload: {
        command: Command.PartyKick,
        username: store.state.messageStore[currentUserIndex].username,
        message: store.state.settings.commandMessages[Command.PartyKick],
      },
    });
  };

  const joinHideout = () => {
    MainProcess.sendEvent({
      name: 'OVERLAY->MAIN::sendCommand',
      payload: {
        command: Command.JoinHideout,
        username: store.state.messageStore[currentUserIndex].username,
      },
    });
  };

  const whoIsPlayer = () => {
    MainProcess.sendEvent({
      name: 'OVERLAY->MAIN::sendCommand',
      payload: {
        command: Command.WhoIs,
        username: store.state.messageStore[currentUserIndex].username,
      },
    });
  };

  const invitePlayer = () => {
    MainProcess.sendEvent({
      name: 'OVERLAY->MAIN::sendCommand',
      payload: {
        command: Command.PartyInvite,
        username: store.state.messageStore[currentUserIndex].username,
        message: store.state.settings.commandMessages[Command.PartyInvite],
      },
    });
  };

  const renderUsername = () => {
    return (
      <Typography className={classNames(classes.username)}>
        {store.state.messageStore[currentUserIndex].username}
      </Typography>
    );
  };

  const renderUserCTAs = () => {
    return (
      <div className={classNames(classes.ctaLeft)}>
        <Tooltip title="Who is the Player?">
          <IconButton
            onClick={whoIsPlayer}
            sx={{ color: theme.svg.buttonColor }}
          >
            <HelpIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Invite Player to Group">
          <IconButton
            onClick={invitePlayer}
            sx={{ color: theme.svg.buttonColor }}
          >
            <GroupAddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Enter Player Hideout">
          <IconButton
            onClick={joinHideout}
            sx={{ color: theme.svg.buttonColor }}
          >
            <OtherHousesIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Initiate Trade with Player">
          <IconButton
            onClick={tradePlayer}
            sx={{ color: theme.svg.buttonColor }}
          >
            <CurrencyExchangeIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Thank the Player for the Trade">
          <IconButton
            onClick={thankPlayer}
            sx={{ color: theme.svg.buttonColor }}
          >
            <ThumbUpAltIcon />
          </IconButton>
        </Tooltip>
      </div>
    );
  };

  const renderRightCTAs = () => {
    return (
      <div className={classNames(classes.ctaRight)}>
        {store.state.messageStore.length > 0 && (
          <Tooltip title="Delete Chat History">
            <IconButton
              onClick={deleteChatHistory}
              sx={{ color: theme.svg.buttonColor }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Minimize Messenger">
          <IconButton
            onClick={toggleMessenger}
            sx={{ color: theme.svg.buttonColor }}
          >
            <RemoveIcon />
          </IconButton>
        </Tooltip>
      </div>
    );
  };

  return (
    <AppBar position="static">
      <Toolbar variant="dense" style={{ paddingRight: '8px' }}>
        {store.state.messageStore.length > 0 && renderUsername()}
        <div className={classNames(classes.ctaWrapper)}>
          {store.state.messageStore.length > 0 && renderUserCTAs()}
          {renderRightCTAs()}
        </div>
      </Toolbar>
    </AppBar>
  );
}
