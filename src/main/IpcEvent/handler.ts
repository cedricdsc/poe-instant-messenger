import { Key, keyboard, sleep } from '@nut-tree/nut-js';
import { clipboard } from 'electron';
import startLogWatcher from '../LogWatcher/watch';
import Store from '../Store/ElectronStore';
import {
  focusOverlay,
  focusPoE,
  isPoeFocused,
  overlayOnEvent,
} from '../Window/MainWindow';

export default function setupIpcEventHandler() {
  overlayOnEvent('OVERLAY->MAIN::mouseEnter', (ipcMainEvent, payload) => {
    if (payload.mouseEntered) focusOverlay();
  });

  overlayOnEvent('OVERLAY->MAIN::mouseLeave', (ipcMainEvent, payload) => {
    if (payload.mouseLeft) focusPoE();
  });

  overlayOnEvent('OVERLAY->MAIN::finishSetup', (ipcMainEvent, payload) => {
    const path = payload.path.replace(/\\/g, '/');
    Store.set('settings.logPath', `${path}logs/Client.txt`);
    Store.set('settings.setUp', true);
    startLogWatcher();
  });

  overlayOnEvent(
    'OVERLAY->MAIN::deleteChatHistory',
    (ipcMainEvent, payload) => {
      const messageStore = Store.get('messageStore');
      const characterIndex = messageStore.findIndex(
        (character) => character.username === payload.username
      );
      if (characterIndex !== -1) {
        messageStore.splice(characterIndex, 1);
        Store.set('messageStore', messageStore);
      }
    }
  );

  overlayOnEvent('OVERLAY->MAIN::readMessages', (ipcMainEvent, payload) => {
    const messageStore = Store.get('messageStore');
    const characterIndex = messageStore.findIndex(
      (character) => character.username === payload.username
    );
    if (characterIndex !== -1) {
      messageStore[characterIndex].unread = 0;
      Store.set('messageStore', messageStore);
    }
  });

  overlayOnEvent(
    'OVERLAY->MAIN::window-pos-changed',
    (ipcMainEvent, payload) => {
      Store.set('settings.windowPosX', payload.x);
      Store.set('settings.windowPosY', payload.y);
    }
  );

  overlayOnEvent(
    'OVERLAY->MAIN::sendMessage',
    async (ipcMainEvent, payload) => {
      clipboard.writeText(`@${payload.recipient} ${payload.text}`);

      /* eslint-disable no-await-in-loop */
      for (let i = 0; i < 10; i += 1) {
        focusPoE();
        await sleep(100);
        if (isPoeFocused()) break;
      }

      await keyboard.pressKey(Key.Enter);
      await keyboard.releaseKey(Key.Enter);
      await keyboard.pressKey(Key.LeftControl, Key.V);
      await keyboard.releaseKey(Key.LeftControl, Key.V);
      await keyboard.pressKey(Key.Enter);
      await keyboard.releaseKey(Key.Enter);
      focusOverlay();
    }
  );
}
