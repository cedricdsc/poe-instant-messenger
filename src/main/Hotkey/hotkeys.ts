import { uIOhook } from 'uiohook-napi';
import { isPoeFocused, overlaySendEvent } from '../Window/MainWindow';
import ClipboardObserver from '../Clipboard/ClipboardObserver';
import Hotkey from './Hotkey';
import HotkeyManager from './HotkeyManager';
import sendCommand from '../Command/sendCommand';
import Command from '../Command/Command';
import HotkeyActionTypes from './HotkeyActionTypes';

const illegalKeycodes = [29, 42, 56];

function assignHotkey(hotkey: Hotkey) {
  if (!illegalKeycodes.includes(hotkey.keycode)) {
    if (HotkeyManager.assignMode.actionType) {
      overlaySendEvent({
        name: 'MAIN->OVERLAY::hotkeySet',
        payload: { hotkey, actionType: HotkeyManager.assignMode.actionType },
      });
    }
    HotkeyManager.assignMode = { assign: false, actionType: undefined };
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

    if (HotkeyManager.assignMode.assign) {
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
    if (potentialAction === 'toggle-cb-observer') {
      ClipboardObserver.toggleObservation();
    }
    if (potentialAction === 'join-own-hideout') {
      if (isPoeFocused()) sendCommand({ command: Command.JoinHideout });
    }
  });

  uIOhook.start();
}
