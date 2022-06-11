import { Collapse, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import classNames from 'classnames';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import Box from '@mui/system/Box';
import { useState } from 'react';
import MainProcess from '../../background/mainProcess';
import { useStore } from '../../background/store';
import classes from './Notifier.module.scss';
import { getTheme } from '../../background/util';

const NotifierButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.svg.buttonColor,
  padding: '12px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

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

  MainProcess.onEvent('MAIN->OVERLAY::notify', (payload) => {
    setNotification({ from: payload.from, message: payload.message });
    setNotify(true);
    setTimeout(() => setNotify(false), 5000);
    setUnread(getUnreadCount());
  });

  return (
    <div className={classNames(classes.expandableWrapper)}>
      <NotifierButton>
        <ChatBubbleIcon />
        {unread > 0 && <div className={classNames(classes.dot)}>{unread}</div>}
      </NotifierButton>
      <div className={classNames(classes.collapseWrapper)}>
        <Collapse orientation="horizontal" in={notify} unmountOnExit>
          <Box
            className={classNames(classes.collapseContainer)}
            sx={{
              backgroundColor: getTheme(store).palette.primary.dark,
              borderRadius: '8px',
            }}
          >
            <div className={classNames(classes.notificationWrapper)}>
              <Typography variant="subtitle2" color="white" noWrap>
                From: {notification.from}
              </Typography>
              <Typography variant="caption" color="white" noWrap>
                {notification.message}
              </Typography>
            </div>
          </Box>
        </Collapse>
      </div>
    </div>
  );
}
