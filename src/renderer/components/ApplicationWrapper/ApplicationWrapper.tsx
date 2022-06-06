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

export default function ApplicationWrapper() {
  const [storeLoaded, setStoreLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [messengerOpen, setMessengerOpen] = useState(false);
  const { store, setStore } = useStore();
  const nodeRef = useRef(null);

  MainProcess.onEvent('MAIN->OVERLAY::main-store-changed', (payload) => {
    setStore({
      state: payload.Store,
      dispatch: () => {},
    });
    setStoreLoaded(true);
  });

  const onDragStop: DraggableEventHandler = (
    _e: DraggableEvent,
    d: DraggableData
  ) => {
    setTimeout(() => setIsDragging(false), 0);
    MainProcess.sendEvent({
      name: 'OVERLAY->MAIN::window-pos-changed',
      payload: { x: d.x, y: d.y },
    });
  };

  const onDragStart = () => {
    setTimeout(() => setIsDragging(true), 0);
  };

  const getDefaultPosition = () => {
    return {
      x: store.state.settings.windowPosX,
      y: store.state.settings.windowPosY,
    };
  };

  const toggleMessenger = () => {
    if (!isDragging) {
      if (!messengerOpen) {
        setMessengerOpen(true);
      } else {
        setMessengerOpen(false);
        onElementLeave();
      }
    }
  };

  return (
    <>
      {storeLoaded && store.state.settings.setUp && (
        <Draggable
          nodeRef={nodeRef}
          onStop={onDragStop}
          onDrag={onDragStart}
          defaultPosition={getDefaultPosition()}
        >
          <div
            role="button"
            tabIndex={0}
            ref={nodeRef}
            onMouseEnter={onElementEnter}
            onMouseLeave={onElementLeave}
            onClick={() => {
              if (!messengerOpen) toggleMessenger();
            }}
          >
            {messengerOpen ? (
              <Messenger toggleMessenger={toggleMessenger} />
            ) : (
              <Notifier />
            )}
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
