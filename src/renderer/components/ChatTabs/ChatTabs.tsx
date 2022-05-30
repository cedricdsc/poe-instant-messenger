import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import classNames from 'classnames';
import { SyntheticEvent } from 'react';
import Typography from '@mui/material/Typography';
import { useStore } from '../../background/store';
import classes from './ChatTabs.module.scss';

interface ChatTabsProps {
  currentUserIndex: number;
  handleChange: (arg0: SyntheticEvent, arg1: number) => void;
}

export default function ChatTabs({
  currentUserIndex,
  handleChange,
}: ChatTabsProps) {
  const { store } = useStore();

  const renderTabs = () => {
    return (
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={currentUserIndex}
        onChange={handleChange}
        sx={{
          borderRight: 1,
          borderColor: 'divider',
          '& .Mui-disabled': { opacity: '0.25!important' },
        }}
        className={classNames(classes.sideBar)}
      >
        {store.state.messageStore.map((entry) => (
          <Tab
            key={`user-${entry.username}`}
            className={classNames(classes.usernameLabel)}
            label={
              <div className={classNames(classes.labelWrapper)}>
                <span
                  className={classNames(classes.labelName, {
                    [classes.short]: entry.unread > 0,
                  })}
                >
                  {entry.username}
                </span>
                {entry.unread > 0 && (
                  <div className={classNames(classes.labelDot)}>
                    {entry.unread}
                  </div>
                )}
              </div>
            }
          />
        ))}
      </Tabs>
    );
  };

  const renderEmptyTabs = () => {
    return (
      <div className={classNames(classes.emptySideBar)}>
        <Typography variant="body2">No Chats available</Typography>
      </div>
    );
  };

  return (
    <>
      {store.state.messageStore.length > 0 ? renderTabs() : renderEmptyTabs()}
    </>
  );
}
