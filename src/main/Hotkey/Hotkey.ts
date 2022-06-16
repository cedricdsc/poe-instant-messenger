import { UiohookKey, UiohookKeyboardEvent } from 'uiohook-napi';
import IHotkey from './IHotkey';

const UiohookToName = Object.fromEntries(
  Object.entries(UiohookKey).map(([k, v]) => [v, k])
);

class Hotkey implements IHotkey {
  keycode: number;

  ctrlKey: boolean;

  altKey: boolean;

  shiftKey: boolean;

  keyName: string;

  constructor(event: UiohookKeyboardEvent) {
    this.keycode = event.keycode;
    this.ctrlKey = event.ctrlKey;
    this.altKey = event.altKey;
    this.shiftKey = event.shiftKey;
    this.keyName = UiohookToName[this.keycode];
  }
}

export default Hotkey;
