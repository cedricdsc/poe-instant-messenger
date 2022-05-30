import { Paper, Typography } from '@mui/material';
import classNames from 'classnames';
import { Direction } from '../../../main/Message/Direction';
import { Message } from '../../../main/Message/Message';
import classes from './ChatMessage.module.scss';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <Paper
      className={classNames(classes.message, {
        [classes.incoming]: message.direction === Direction.Incoming,
        [classes.outgoing]: message.direction === Direction.Outgoing,
      })}
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
