import { clipboard } from 'electron';
import { Key, keyboard, sleep } from '@nut-tree/nut-js';
import readLastLines from 'read-last-lines';
import Store from '../Store/ElectronStore';
import {
  focusOverlay,
  focusPoE,
  isPoeFocused,
  getMainWindow,
} from '../Window/MainWindow';

const forceFocus = require('forcefocus');

const performInput = async (opts = { skip: true }) => {
  if (!opts.skip) {
    await keyboard.pressKey(Key.Enter);
    await keyboard.releaseKey(Key.Enter);
  }
  await keyboard.pressKey(Key.LeftControl, Key.V);
  await keyboard.releaseKey(Key.LeftControl, Key.V);
  await keyboard.pressKey(Key.Enter);
  await keyboard.releaseKey(Key.Enter);
};

export const focusGame = async () => {
  const mainWindow = getMainWindow();
  if (mainWindow) {
    forceFocus.focusWindow(mainWindow);
  }
};

const verifyMessageSent = (
  recipient: string,
  textContent: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    const settings = Store.get('settings');
    const { logPath } = settings;

    readLastLines
      .read(logPath, 8)
      .then((lastLines) => {
        const lines = lastLines.split(/\n|\r/);

        const comparisonDate = new Date();

        for (const line of lines) {
          if (
            line.includes('@To') &&
            line.includes(recipient) &&
            line.substring(line.indexOf(': ') + 2).search(textContent) === 0
          ) {
            const minute = Number(line.substring(14, 16));
            const second = Number(line.substring(17, 19));
            if (
              comparisonDate.getMinutes() === minute &&
              comparisonDate.getSeconds() - second < 2
            ) {
              return true;
            }
          }
        }

        return false;
      })
      .then(resolve)
      .catch((error) => {
        resolve(false);
      });
  });
};

const sendWhisperMessage = async (
  recipient: string,
  textContent: string,
  iterationCount = 0
) => {
  // to prevent infinite loop on error
  if (iterationCount < 4) {
    clipboard.writeText(`@${recipient} ${textContent}`);

    focusPoE();

    if (isPoeFocused()) {
      performInput();
    }

    const isMessageSent = await verifyMessageSent(recipient, textContent);

    if (!isMessageSent) {
      await sendWhisperMessage(recipient, textContent, iterationCount + 1);
    }

    focusOverlay();
  }
};

export const sendTradeMessage = async () => {
  await focusGame();

  focusPoE();

  await sleep(100);
  if (isPoeFocused()) {
    performInput({ skip: false });
  }
};

export const sendCommandMessage = async (opts?: { fromOverlay: boolean }) => {
  let fromOverlay = false;
  if (opts) fromOverlay = opts.fromOverlay;

  focusPoE();
  await sleep(100);
  if (isPoeFocused()) {
    performInput({ skip: false });
  }
  if (fromOverlay) focusOverlay();
};

export default sendWhisperMessage;
