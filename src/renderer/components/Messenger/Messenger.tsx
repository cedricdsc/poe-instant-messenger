import Typography from '@mui/material/Typography';
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useStore } from '../../background/store';
import MainProcess from '../../background/mainProcess';
import ChatMessage from '../ChatMessage/ChatMessage';
import classes from './Messenger.module.scss';
import BottomBar from '../BottomBar/BottomBar';
import ChatInput from '../ChatInput/ChatInput';
import ChatTabs from '../ChatTabs/ChatTabs';
import TopBar from '../TopBar/TopBar';
import { getTheme } from '../../background/util';

interface MessengerProps {
  toggleMessenger: () => void;
  toggleSettings: () => void;
}

export default function Messenger({
  toggleMessenger,
  toggleSettings,
}: MessengerProps) {
  const { store } = useStore();
  const [currentUser, setCurrentUser] = useState({ index: 0, name: '' });

  if (
    store.state.messageStore.length > 0 &&
    currentUser.name !== store.state.messageStore[currentUser.index].username
  ) {
    const newUserIndex = store.state.messageStore.findIndex(
      (character) => character.username === currentUser.name
    );
    if (newUserIndex >= 0)
      setCurrentUser({ ...currentUser, index: newUserIndex });
  }

  const handleChange = (_event: SyntheticEvent, newCurrentUser: number) => {
    setCurrentUser({
      index: newCurrentUser,
      name: store.state.messageStore[newCurrentUser].username,
    });
    MainProcess.sendEvent({
      name: 'OVERLAY->MAIN::readMessages',
      payload: {
        username: store.state.messageStore[currentUser.index].username,
      },
    });
  };

  const deleteChatHistory = () => {
    if (currentUser.index === store.state.messageStore.length - 1) {
      const index = currentUser.index - 1 < 0 ? 0 : currentUser.index - 1;
      setCurrentUser({ index, name: store.state.messageStore[index].username });
    }
    MainProcess.sendEvent({
      name: 'OVERLAY->MAIN::deleteChatHistory',
      payload: {
        username: store.state.messageStore[currentUser.index].username,
      },
    });
  };

  const AlwaysScrollToBottom = () => {
    const elementRef = useRef<HTMLDivElement>(null);
    useEffect(() => elementRef.current?.scrollIntoView());
    return <div ref={elementRef} />;
  };

  const renderChatMessages = () => {
    return (
      <div className={classNames(classes.chatBox)}>
        {store.state.messageStore[currentUser.index].messages.map((message) => (
          <ChatMessage key={uuidv4()} message={message} />
        ))}
        <AlwaysScrollToBottom />
      </div>
    );
  };

  const renderEmptyChat = () => {
    return (
      <div className={classNames(classes.emptyChat)}>
        <Typography variant="body1">No Messages available, Exile.</Typography>
      </div>
    );
  };

  return (
    <>
      <div
        className={classNames(classes.container)}
        style={{ backgroundColor: getTheme(store).palette.background.default }}
      >
        <div className={classNames(classes.topWrapper)}>
          <ChatTabs
            handleChange={handleChange}
            currentUserIndex={currentUser.index}
          />
          <div className={classNames(classes.chatBoxWrapper)}>
            <TopBar
              currentUserIndex={currentUser.index}
              toggleMessenger={toggleMessenger}
              deleteChatHistory={deleteChatHistory}
            />

            {store.state.messageStore.length > 0
              ? renderChatMessages()
              : renderEmptyChat()}
          </div>
        </div>
        <div className={classNames(classes.bottomWrapper)}>
          <BottomBar toggleSettings={toggleSettings} />
          {store.state.messageStore.length > 0 && (
            <ChatInput currentUserIndex={currentUser.index} />
          )}
        </div>
      </div>
    </>
  );
}
