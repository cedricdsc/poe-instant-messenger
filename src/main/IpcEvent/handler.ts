import { clipboard } from 'electron';
import sendMessage from '../Message/sendMessage';
import startLogWatcher from '../LogWatcher/watch';
import Store from '../Store/ElectronStore';
import {
  focusOverlay,
  focusPoE,
  overlayOnEvent,
  overlaySendEvent,
} from '../Window/MainWindow';
import { TradeStatus } from '../Character/CharacterStatus';

function getStoreData(username: string) {
  const messageStore = Store.get('messageStore');
  const characterIndex = messageStore.findIndex(
    (character) => character.username === username
  );
  return { messageStore, characterIndex };
}

export default function setupIpcEventHandler() {
  overlayOnEvent('OVERLAY->MAIN::mouseEnter', (_ipcMainEvent, payload) => {
    if (payload.mouseEntered) focusOverlay();
  });

  overlayOnEvent('OVERLAY->MAIN::mouseLeave', (_ipcMainEvent, payload) => {
    if (payload.mouseLeft) focusPoE();
  });

  overlayOnEvent('OVERLAY->MAIN::finishSetup', (_ipcMainEvent, payload) => {
    const path = payload.path.replace(/\\/g, '/');
    Store.set('settings.logPath', `${path}logs/Client.txt`);
    Store.set('settings.setUp', true);
    startLogWatcher(overlaySendEvent);
  });

  overlayOnEvent(
    'OVERLAY->MAIN::deleteChatHistory',
    (_ipcMainEvent, payload) => {
      const { messageStore, characterIndex } = getStoreData(payload.username);

      if (characterIndex !== -1) {
        messageStore.splice(characterIndex, 1);
        Store.set('messageStore', messageStore);
      }
    }
  );

  overlayOnEvent('OVERLAY->MAIN::readMessages', (_ipcMainEvent, payload) => {
    const { messageStore, characterIndex } = getStoreData(payload.username);

    if (characterIndex !== -1) {
      messageStore[characterIndex].unread = 0;
      Store.set('messageStore', messageStore);
    }
  });

  overlayOnEvent(
    'OVERLAY->MAIN::window-pos-changed',
    (_ipcMainEvent, payload) => {
      Store.set('settings.windowPosX', payload.x);
      Store.set('settings.windowPosY', payload.y);
    }
  );

  overlayOnEvent('OVERLAY->MAIN::sendCommand', (_ipcMainEvent, payload) => {
    if (payload.tradeStatus === TradeStatus.Initiated && payload.username) {
      const { messageStore, characterIndex } = getStoreData(payload.username);
      if (characterIndex !== -1) {
        messageStore[characterIndex].tradeStatus = payload.tradeStatus;
        Store.set('messageStore', messageStore);
      }
    }

    if (payload.username) {
      clipboard.writeText(`${payload.command}${payload.username}`);
    } else {
      clipboard.writeText(`${payload.command}`);
    }

    sendMessage();
  });

  overlayOnEvent(
    'OVERLAY->MAIN::sendMessage',
    async (_ipcMainEvent, payload) => {
      clipboard.writeText(`@${payload.recipient} ${payload.text}`);

      sendMessage();
    }
  );
}
