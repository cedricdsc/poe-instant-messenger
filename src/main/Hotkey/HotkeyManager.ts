import Store from '../Store/ElectronStore';
import Hotkey from './Hotkey';
import HotkeyActionTypes, { isHotkeyActionType } from './HotkeyActionTypes';

interface HotkeyAssign {
  assign: boolean;
  actionType: HotkeyActionTypes | undefined;
}

class HotkeyManager {
  hotkeyMap: Map<HotkeyActionTypes, Hotkey>;

  assignMode: HotkeyAssign;

  constructor() {
    this.hotkeyMap = new Map<HotkeyActionTypes, Hotkey>();
    this.assignMode = { assign: false, actionType: undefined };
    this.loadHotkeysFromStore();
  }

  register(hotkey: Hotkey, hotkeyAction: HotkeyActionTypes) {
    if (!this.getActionFromHotkey(hotkey)) {
      this.hotkeyMap.set(hotkeyAction, hotkey);
    }
  }

  getActionFromHotkey(hotkey: Hotkey) {
    for (const [key, value] of this.hotkeyMap.entries()) {
      if (hotkey.equals(value)) return key;
    }
    return undefined;
  }

  updateHotkeys() {
    this.hotkeyMap = new Map<HotkeyActionTypes, Hotkey>();
    this.loadHotkeysFromStore();
  }

  loadHotkeysFromStore() {
    const settings = Store.get('settings');

    for (const hotkeyAction in settings.hotkeys) {
      if (isHotkeyActionType(hotkeyAction)) {
        const loadedHotkey = settings.hotkeys[hotkeyAction];
        const newHotkey = new Hotkey({
          type: 5,
          metaKey: false,
          ctrlKey: loadedHotkey.ctrlKey,
          altKey: loadedHotkey.altKey,
          shiftKey: loadedHotkey.shiftKey,
          keycode: loadedHotkey.keycode,
        });
        this.hotkeyMap.set(hotkeyAction, newHotkey);
      }
    }
  }
}

export default new HotkeyManager();
