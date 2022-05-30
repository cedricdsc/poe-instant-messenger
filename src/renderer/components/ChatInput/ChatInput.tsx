import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import SendIcon from '@mui/icons-material/Send';
import classNames from 'classnames';
import classes from './ChatInput.module.scss';
import {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  useRef,
  useState,
} from 'react';
import MainProcess from 'renderer/background/mainProcess';
import { useStore } from 'renderer/background/store';

interface ChatInputProps {
  currentUserIndex: number;
}

export default function ChatInput({ currentUserIndex }: ChatInputProps) {
  const [currentMessage, setCurrentMessage] = useState('');
  const { store } = useStore();
  const inputElement = useRef<HTMLInputElement>(null);

  const handleTextfieldInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentMessage(event.target.value);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  const handleSendButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    sendMessage();
  };

  const sendMessage = () => {
    if (currentMessage.length > 0) {
      MainProcess.sendEvent({
        name: 'OVERLAY->MAIN::sendMessage',
        payload: {
          text: currentMessage,
          recipient: store.state.messageStore[currentUserIndex].username,
        },
      });
      if (inputElement) {
        if (inputElement.current) inputElement.current.value = '';
      }
    }
  };

  return (
    <Paper className={classNames(classes.inputWrapper)}>
      <TextField
        variant="standard"
        placeholder="Type message..."
        fullWidth
        onChange={handleTextfieldInputChange}
        onKeyDown={handleInputKeyDown}
        inputRef={inputElement}
      ></TextField>
      <Tooltip title="Send Message">
        <IconButton onClick={handleSendButtonClick} color="primary">
          <SendIcon />
        </IconButton>
      </Tooltip>
    </Paper>
  );
}
