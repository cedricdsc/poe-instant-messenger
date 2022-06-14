import { Key, keyboard, sleep } from '@nut-tree/nut-js';
import {
  focusOverlay,
  focusPoE,
  isPoeFocused,
  getMainWindow,
} from '../Window/MainWindow';

const forceFocus = require('forcefocus');

interface SendMessageProps {
  skipOverlayFocus: boolean;
}

const sendMessage = async (options?: SendMessageProps) => {
  /* eslint-disable no-await-in-loop */
  for (let i = 0; i < 10; i += 1) {
    focusPoE();
    await sleep(150);
    if (isPoeFocused()) {
      await keyboard.pressKey(Key.Enter);
      await keyboard.releaseKey(Key.Enter);
      await keyboard.pressKey(Key.LeftControl, Key.V);
      await keyboard.releaseKey(Key.LeftControl, Key.V);
      await keyboard.pressKey(Key.Enter);
      await keyboard.releaseKey(Key.Enter);

      if (!options) focusOverlay();

      break;
    }
  }
};

export const sendMessageFromTradeSite = async () => {
  const mainWindow = getMainWindow();
  if (mainWindow) {
    forceFocus.focusWindow();
    await sleep(150);
    sendMessage({ skipOverlayFocus: true });
  }
};

export default sendMessage;
