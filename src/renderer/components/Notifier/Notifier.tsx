import { Collapse, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import classNames from 'classnames';
import globals from '../../globals/_variables.module.scss';
import classes from './Notifier.module.scss';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import Box from '@mui/system/Box';
import { useEffect, useState } from 'react';
import MainProcess from 'renderer/background/mainProcess';
import { useStore } from 'renderer/background/store';

const NotifierButton = styled(IconButton)({
  backgroundColor: globals.bgColorPrimary,
  color: '#ffffff',
  padding: '12px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: globals.bgColorPrimary,
  },
});

export default function Notifier() {
  const [notification, setNotification] = useState({ from: '', message: '' });
  const [unread, setUnread] = useState(0);
  const [notify, setNotify] = useState(false);
  const { store } = useStore();

  const getUnreadCount = () => {
    let counter = 0;
    store.state.messageStore.forEach((entry) => {
      counter += entry.unread;
    });
    return counter;
  };

  useEffect(() => {
    setUnread(getUnreadCount());
  }, [notify]);

  MainProcess.onEvent('MAIN->OVERLAY::notify', (payload) => {
    setNotification({ from: payload.from, message: payload.message });
    setNotify(true);
    setTimeout(() => setNotify(false), 5000);
  });

  return (
    <div className={classNames(classes.expandableWrapper)}>
      <NotifierButton>
        <ChatBubbleIcon></ChatBubbleIcon>
        {unread > 0 && <div className={classNames(classes.dot)}>{unread}</div>}
      </NotifierButton>
      <div className={classNames(classes.collapseWrapper)}>
        <Collapse orientation="horizontal" in={notify} unmountOnExit>
          <Box
            className={classNames(classes.collapseContainer)}
            sx={{
              backgroundColor: globals.bgColorSecondary,
              borderRadius: '8px',
            }}
          >
            <div className={classNames(classes.notificationWrapper)}>
              <Typography variant="subtitle2" color={'white'} noWrap>
                From: {notification.from}
              </Typography>
              <Typography variant="caption" color={'white'} noWrap>
                {notification.message}
              </Typography>
            </div>
          </Box>
        </Collapse>
      </div>
    </div>
  );
}
