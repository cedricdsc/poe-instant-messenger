import { uIOhook } from 'uiohook-napi';
import ClipboardObserver from '../Clipboard/ClipboardObserver';
import Hotkey from './Hotkey';
import HotkeyManager from './HotkeyManager';

export default function initializeHotkeyListener() {
  uIOhook.on('keydown', (event) => {
    const potentialHotkey = new Hotkey(event);
    const potentialAction = HotkeyManager.getActionFromHotkey(potentialHotkey);
    if (potentialAction) {
      if (potentialAction === 'toggle-cb-observer') {
        ClipboardObserver.toggleObservation();
      }
    }
  });

  uIOhook.start();
}
