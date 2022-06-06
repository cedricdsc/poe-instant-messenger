import { Key, keyboard, sleep } from '@nut-tree/nut-js';
import { focusOverlay, focusPoE, isPoeFocused } from '../Window/MainWindow';

const sendMessage = async () => {
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
      focusOverlay();
      break;
    }
  }
};

export default sendMessage;
