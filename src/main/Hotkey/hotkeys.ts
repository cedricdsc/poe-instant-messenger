import { uIOhook } from 'uiohook-napi';
import { overlaySendEvent } from '../Window/MainWindow';
import ClipboardObserver from '../Clipboard/ClipboardObserver';
import Hotkey from './Hotkey';
import HotkeyManager from './HotkeyManager';

const illegalKeycodes = [29, 42, 56];

function assignHotkey(hotkey: Hotkey) {
  if (!illegalKeycodes.includes(hotkey.keycode)) {
    overlaySendEvent({
      name: 'MAIN->OVERLAY::hotkeySet',
      payload: { hotkey },
    });
    HotkeyManager.assignMode = false;
  } else {
    overlaySendEvent({
      name: 'MAIN->OVERLAY::hotkeyError',
      payload: {
        text: 'Selected Hotkey is illegal. Please do not choose Ctrl, Alt and Shift.',
      },
    });
  }
}

export default function initializeHotkeyListener() {
  uIOhook.on('keydown', (event) => {
    const potentialHotkey = new Hotkey(event);
    const potentialAction = HotkeyManager.getActionFromHotkey(potentialHotkey);

    if (HotkeyManager.assignMode) {
      if (!potentialAction) {
        assignHotkey(potentialHotkey);
      } else {
        overlaySendEvent({
          name: 'MAIN->OVERLAY::hotkeyError',
          payload: {
            text: 'Selected Hotkey is already assigned. Please choose a different key.',
          },
        });
      }
    }
    // Hotkey actions
    if (potentialAction === 'toggle-cb-observer') {
      ClipboardObserver.toggleObservation();
    }
  });

  uIOhook.start();
}
