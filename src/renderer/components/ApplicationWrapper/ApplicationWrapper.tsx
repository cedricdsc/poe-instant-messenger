import classNames from 'classnames';
import { useRef, useState } from 'react';
import Draggable, {
  DraggableData,
  DraggableEvent,
  DraggableEventHandler,
} from 'react-draggable';
import MainProcess from '../../background/mainProcess';
import { useStore } from '../../background/store';
import classes from './ApplicationWrapper.module.scss';
import { onElementEnter, onElementLeave } from '../../background/util';
import Messenger from '../Messenger/Messenger';
import Notifier from '../Notifier/Notifier';
import SetupStepper from '../SetupStepper/SetupStepper';
import Settings from '../Settings/Settings';

export default function ApplicationWrapper() {
  const [storeLoaded, setStoreLoaded] = useState(false);
  const [messengerOpen, setMessengerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { store, setStore } = useStore();
  const nodeRef = useRef(null);

  const getDefaultPosition = () => {
    return {
      x: store.state.settings.windowPosX,
      y: store.state.settings.windowPosY,
    };
  };

  const { x, y } = getDefaultPosition();

  MainProcess.onEvent('MAIN->OVERLAY::main-store-changed', (payload) => {
    setStore({
      state: payload.Store,
      dispatch: () => {},
    });
    setStoreLoaded(true);
  });

  const toggleMessenger = () => {
    if (!messengerOpen) {
      setMessengerOpen(true);
    } else {
      setMessengerOpen(false);
      onElementLeave();
    }
  };

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

  const onDragStop: DraggableEventHandler = (
    _e: DraggableEvent,
    d: DraggableData
  ) => {
    if (Math.abs(x - d.x) > 1 || Math.abs(y - d.y) > 1) {
      MainProcess.sendEvent({
        name: 'OVERLAY->MAIN::window-pos-changed',
        payload: { x: d.x, y: d.y },
      });
    } else if (!messengerOpen) toggleMessenger();
  };

  return (
    <>
      {storeLoaded && store.state.settings.setUp && (
        <Draggable
          disabled={settingsOpen}
          nodeRef={nodeRef}
          onStop={onDragStop}
          defaultPosition={getDefaultPosition()}
        >
          <div
            role="button"
            tabIndex={0}
            ref={nodeRef}
            onMouseEnter={onElementEnter}
            onMouseLeave={onElementLeave}
            className={classNames(classes.appWrapper)}
          >
            {messengerOpen && !settingsOpen && (
              <Messenger
                toggleMessenger={toggleMessenger}
                toggleSettings={toggleSettings}
              />
            )}
            {messengerOpen && settingsOpen && (
              <Settings toggleSettings={toggleSettings} />
            )}
            {!messengerOpen && <Notifier />}
          </div>
        </Draggable>
      )}
      <div
        className={classNames({
          [classes.fullWidth]: !store.state.settings.setUp,
        })}
      >
        {storeLoaded && !store.state.settings.setUp && <SetupStepper />}
      </div>
    </>
  );
}
