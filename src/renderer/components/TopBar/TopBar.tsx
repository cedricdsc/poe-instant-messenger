import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import HouseIcon from '@mui/icons-material/House';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import classNames from 'classnames';
import MainProcess from 'renderer/background/mainProcess';
import { useStore } from '../../background/store';
import classes from './TopBar.module.scss';
import Command from '../../../main/Command/Command';

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

  const tradeUser = () => {
    MainProcess.sendEvent({
      name: 'OVERLAY->MAIN::sendCommand',
      payload: {
        command: Command.TradeInvite,
        username: store.state.messageStore[currentUserIndex].username,
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
        <Tooltip title="Enter Player Hideout">
          <IconButton disabled>
            <HouseIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Initiate Trade with Player">
          <IconButton onClick={tradeUser}>
            <CurrencyExchangeIcon />
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
            <IconButton onClick={deleteChatHistory}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Minimize Messenger">
          <IconButton onClick={toggleMessenger}>
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
