import { Key, keyboard, sleep } from '@nut-tree/nut-js';
import PoeWindow from '../Window/PoeWindow';
import {
  focusOverlay,
  focusPoE,
  isPoeFocused,
  getMainWindow,
} from '../Window/MainWindow';

const forceFocus = require('forcefocus');

const MAX_TRIES = 10;

interface SendMessageProps {
  skipOverlayFocus: boolean;
}

const sendMessage = async (count: number, options?: SendMessageProps) => {
  if (count < MAX_TRIES) {
    focusPoE();
    await sleep(100);
    if (isPoeFocused()) {
      await keyboard.pressKey(Key.Enter);
      await keyboard.releaseKey(Key.Enter);
      await keyboard.pressKey(Key.LeftControl, Key.V);
      await keyboard.releaseKey(Key.LeftControl, Key.V);
      await keyboard.pressKey(Key.Enter);
      await keyboard.releaseKey(Key.Enter);

      if (!options) focusOverlay();
    } else {
      sendMessage(count + 1, options);
    }
  }
};

export const sendMessageFromTradeSite = async () => {
  const mainWindow = getMainWindow();
  if (mainWindow) {
    forceFocus.focusWindow(mainWindow);
    sendMessage(0, { skipOverlayFocus: true });
  }
};

export default sendMessage;
