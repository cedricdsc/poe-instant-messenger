import { Paper, Typography } from '@mui/material';
import classNames from 'classnames';
import { useStore } from '../../background/store';
import { getTheme } from '../../background/util';
import Direction from '../../../main/Message/Direction';
import Message from '../../../main/Message/Message';
import classes from './ChatMessage.module.scss';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { store } = useStore();
  const theme = getTheme(store);

  return (
    <Paper
      className={classNames(classes.message, {
        [classes.incoming]: message.direction === Direction.Incoming,
        [classes.outgoing]: message.direction === Direction.Outgoing,
      })}
      sx={{
        backgroundColor:
          message.direction === Direction.Incoming
            ? theme.palette.background.paper
            : theme.chatMessage.outgoing,
      }}
      elevation={3}
    >
      <Typography variant="body1">{message.text}</Typography>
      <Typography variant="body2" className={classNames(classes.timestamp)}>
        {new Date(message.timestamp).toLocaleTimeString(navigator.language, {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Typography>
    </Paper>
  );
}
