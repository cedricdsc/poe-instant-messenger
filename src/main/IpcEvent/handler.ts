import fs from 'fs';
import { clipboard, dialog } from 'electron';
import sendMessage from '../Message/sendMessage';
import startLogWatcher from '../LogWatcher/watch';
import Store from '../Store/ElectronStore';
import {
  disableOverlayPointerEvents,
  enableOverlayPointerEvents,
  focusOverlay,
  focusPoE,
  isMainWindowFocused,
  isPoeFocused,
  overlayOnEvent,
  overlaySendEvent,
  sendUpdateStoreEvent,
} from '../Window/MainWindow';
import HotkeyManager from '../Hotkey/HotkeyManager';
import sendCommand from '../Command/sendCommand';

function getStoreData(username: string) {
  const messageStore = Store.get('messageStore');
  const characterIndex = messageStore.findIndex(
    (character) => character.username === username
  );
  return { messageStore, characterIndex };
}

export default function setupIpcEventHandler() {
  overlayOnEvent('OVERLAY->MAIN::mouseEnter', (_ipcMainEvent) => {
    if (!!isMainWindowFocused() || isPoeFocused()) focusOverlay();
  });

  overlayOnEvent('OVERLAY->MAIN::mouseLeave', (_ipcMainEvent) => {
    if (!!isMainWindowFocused() || isPoeFocused()) focusPoE();
  });

  overlayOnEvent('OVERLAY->MAIN::finishSetup', (_ipcMainEvent, payload) => {
    Store.set('settings.logPath', `${payload.path}`);
    Store.set('settings.setUp', true);
    startLogWatcher(overlaySendEvent);
  });

  overlayOnEvent('OVERLAY->MAIN::listenForHotkey', (_ipcMainEvent, payload) => {
    HotkeyManager.assignMode = {
      assign: payload.isWaitingForInput,
      actionType: payload.actionType,
    };
  });

  overlayOnEvent('OVERLAY->MAIN::getCurrentStore', () => {
    sendUpdateStoreEvent();
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

  overlayOnEvent('OVERLAY->MAIN::saveSettings', (_ipcMainEvent, payload) => {
    Store.set('settings', payload.settings);
    HotkeyManager.updateHotkeys();
  });

  overlayOnEvent('OVERLAY->MAIN::repeatSetup', (_ipcMainEvent) => {
    Store.set('settings.setUp', false);
  });

  overlayOnEvent('OVERLAY->MAIN::openDialog', (_ipcMainEvent) => {
    disableOverlayPointerEvents();
    dialog
      .showOpenDialog({ properties: ['openDirectory'] })
      .then((response) => {
        enableOverlayPointerEvents();

        const directoryPath = response.filePaths[0].replace(/\\/g, '/');
        const logFilePath = `${directoryPath}/logs/Client.txt`;
        if (fs.existsSync(logFilePath)) {
          overlaySendEvent({
            name: 'MAIN->OVERLAY::validDirectory',
            payload: { path: logFilePath },
          });
        } else {
          overlaySendEvent({
            name: 'MAIN->OVERLAY::invalidDirectory',
            payload: undefined,
          });
        }
        return null;
      })
      .catch((_err) => {});
  });

  overlayOnEvent('OVERLAY->MAIN::toggleTheme', (_ipcMainEvent) => {
    Store.set('settings.darkTheme', !Store.get('settings.darkTheme'));
  });

  overlayOnEvent(
    'OVERLAY->MAIN::window-pos-changed',
    (_ipcMainEvent, payload) => {
      Store.set('settings.windowPosX', payload.x);
      Store.set('settings.windowPosY', payload.y);
    }
  );

  overlayOnEvent(
    'OVERLAY->MAIN::sendCommand',
    async (_ipcMainEvent, payload) => {
      await sendCommand(payload);
    }
  );

  overlayOnEvent(
    'OVERLAY->MAIN::sendMessage',
    async (_ipcMainEvent, payload) => {
      clipboard.writeText(`@${payload.recipient} ${payload.text}`);

      sendMessage(0);
    }
  );
}
