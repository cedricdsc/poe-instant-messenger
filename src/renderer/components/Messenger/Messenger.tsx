import Typography from '@mui/material/Typography';
import classNames from 'classnames';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useStore } from 'renderer/background/store';
import MainProcess from 'renderer/background/mainProcess';
import ChatMessage from '../ChatMessage/ChatMessage';
import classes from './Messenger.module.scss';
import BottomBar from '../BottomBar/BottomBar';
import ChatInput from '../ChatInput/ChatInput';
import ChatTabs from '../ChatTabs/ChatTabs';
import TopBar from '../TopBar/TopBar';

interface MessengerProps {
  toggleMessenger: () => void;
}

export default function Messenger({ toggleMessenger }: MessengerProps) {
  const [currentUser, setCurrentUser] = useState(0);
  const { store } = useStore();

  const handleChange = (_event: SyntheticEvent, newCurrentUser: number) => {
    setCurrentUser(newCurrentUser);
    MainProcess.sendEvent({
      name: 'OVERLAY->MAIN::readMessages',
      payload: { username: store.state.messageStore[currentUser].username },
    });
  };

  const deleteChatHistory = () => {
    if (currentUser === store.state.messageStore.length - 1) {
      setCurrentUser(currentUser - 1 < 0 ? 0 : currentUser - 1);
    }
    MainProcess.sendEvent({
      name: 'OVERLAY->MAIN::deleteChatHistory',
      payload: { username: store.state.messageStore[currentUser].username },
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
        {store.state.messageStore[currentUser].messages.map((message) => (
          <ChatMessage key={message.text} message={message} />
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
      <div className={classNames(classes.container)}>
        <div className={classNames(classes.topWrapper)}>
          <ChatTabs
            handleChange={handleChange}
            currentUserIndex={currentUser}
          />
          <div className={classNames(classes.chatBoxWrapper)}>
            <TopBar
              currentUserIndex={currentUser}
              toggleMessenger={toggleMessenger}
              deleteChatHistory={deleteChatHistory}
            />

            {store.state.messageStore.length > 0
              ? renderChatMessages()
              : renderEmptyChat()}
          </div>
        </div>
        <div className={classNames(classes.bottomWrapper)}>
          <BottomBar />
          {store.state.messageStore.length > 0 && (
            <ChatInput currentUserIndex={currentUser} />
          )}
        </div>
      </div>
    </>
  );
}
