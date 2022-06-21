import { UiohookKey, UiohookKeyboardEvent } from 'uiohook-napi';
import IHotkey from './IHotkey';

const UiohookToName = Object.fromEntries(
  Object.entries(UiohookKey).map(([k, v]) => [v, k])
);

class Hotkey implements IHotkey {
  altKey: boolean;

  ctrlKey: boolean;

  shiftKey: boolean;

  keycode: number;

  keyName: string;

  constructor(event: UiohookKeyboardEvent) {
    this.keycode = event.keycode;
    this.ctrlKey = event.ctrlKey;
    this.altKey = event.altKey;
    this.shiftKey = event.shiftKey;
    this.keyName = UiohookToName[event.keycode];
  }

  equals(hotkey: Hotkey) {
    return (Object.keys(hotkey) as (keyof typeof hotkey)[]).every((key) => {
      return hotkey[key] === this[key];
    });
  }
}

export default Hotkey;
